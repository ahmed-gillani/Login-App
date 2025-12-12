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

    // Read streaming chunks and preserve any newline characters or paragraph
    // breaks provided by the API. Do not trim the data chunk; append as-is.
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      lines.forEach((line) => {
        // Accept lines that start with `data:` (SSE-style). Preserve the
        // payload exactly after the prefix (no `trim()`), so newlines and
        // spacing from the server are kept.
        if (line.startsWith("data:") || line.startsWith("data: ")) {
          const data = line.replace(/^data:\s*/i, "");
          // Some streams send "[DONE]" or empty heartbeats — ignore those.
          if (!data || data === "[DONE]") return;

          // Append payload while preventing accidental word-joining when the
          // stream splits words across chunks. If the previous text ends with
          // an alphanumeric character and the new data starts with one,
          // insert a single space. Preserve all other characters (including
          // newlines) exactly as provided by the API.
          const prevEndsAlphaNum = /[A-Za-z0-9]$/.test(fullText);
          const nextStartsAlphaNum = /^[A-Za-z0-9]/.test(data);
          if (prevEndsAlphaNum && nextStartsAlphaNum) {
            fullText += " ";
          }
          fullText += data;

          if (onStreamChunk) {
            onStreamChunk(fullText);
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
