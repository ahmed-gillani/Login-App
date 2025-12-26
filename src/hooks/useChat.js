import { useMutation } from "@tanstack/react-query";

// API call for sending chat messages
export const sendChatMessage = async ({ message, onStreamChunk }) => {
  const response = await fetch(
    "https://dev.ai.api.connecxguard.com/chatbot",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Facility-Id": "t2y4sv_0954198_YRPC0QP",
      },
      body: JSON.stringify({
        question: message,
        schema_name: "facility_2",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Chat API Error:", errorText);
    throw new Error(`HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;

      const data = line.replace("data:", "").trim();
      if (!data || data === "[DONE]") continue;

      // Format dashes
      if (data === "-") {
        if (fullText && !fullText.endsWith("\n")) fullText += "\n";
        fullText += "- ";
      } else {
        if (fullText && !fullText.endsWith(" ") && !fullText.endsWith("\n")) {
          fullText += " ";
        }
        fullText += data;
      }

      onStreamChunk?.(fullText);
    }
  }

  return { answer: fullText };
};

// Custom hook using TanStack useMutation
export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: sendChatMessage,
    onError: (err) => {
      console.error("Chat mutation error:", err);
    },
  });
};
