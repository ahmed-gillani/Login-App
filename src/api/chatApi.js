// Send message to chatbot API with streaming support
export const sendChatMessage = async (message, onStreamChunk) => {
  try {
    const response = await fetch("https://3-133-101-97.nip.io/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: message,
        schema_name: "facility_2",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      lines.forEach((line) => {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "").trim();
          if (data) {
            // Add space between chunks for readability
            if (fullText && !fullText.endsWith(" ") && !data.startsWith(" ")) {
              fullText += " ";
            }
            fullText += data;
            if (onStreamChunk) {
              onStreamChunk(fullText);
            }
          }
        }
      });
    }

    return { answer: fullText };
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};
