// // src/utils/processChunk.js

// /**
//  * Process raw streaming chunk.
//  * IMPORTANT: Do NOT trim here — backend tokens often have leading/trailing spaces.
//  * We keep everything as-is to preserve natural spacing.
//  */
// export const processChunk = (rawChunk, onChunk) => {
//   if (!rawChunk || typeof rawChunk !== "string") return;

//   let text = rawChunk;

//   // Only remove "data: " prefix, but keep any spaces after it
//   if (text.startsWith("data: ")) {
//     text = text.substring(6);  // Do NOT trim!
//   }

//   // Ignore [DONE] or completely empty
//   if (!text || text === "[DONE]") return;

//   // Pass the exact token (with its spaces)
//   onChunk(text);
// };