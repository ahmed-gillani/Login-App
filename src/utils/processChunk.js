// src/utils/processChunk.js
export const processChunk = (chunk, onChunk) => {
  try {
    if (chunk.startsWith("data: ")) {
      const jsonStr = chunk.substring(6);
      if (jsonStr.trim() === "[DONE]") {
        return;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.data !== undefined) {
          onChunk(parsed.data.toString());
        } else if (typeof parsed === "number") {
          onChunk(parsed.toString());
        } else if (typeof parsed === "string") {
          onChunk(parsed);
        }
      } catch (parseError) {
        onChunk(jsonStr);
      }
    } else {
      try {
        const parsed = JSON.parse(chunk);
        if (parsed.data !== undefined) {
          onChunk(parsed.data.toString());
        } else if (typeof parsed === "number") {
          onChunk(parsed.toString());
        } else if (typeof parsed === "string") {
          onChunk(parsed);
        }
      } catch (parseError) {
        onChunk(chunk);
      }
    }
  } catch (error) {
    console.warn("Error processing chunk:", error);
    onChunk(chunk);
  }
};