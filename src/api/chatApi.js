// // src/api/chatApi.js
// export const sendChatMessage = async ({ message, onStreamChunk, onComplete, onError }) => {
//   const response = await fetch("https://dev.ai.api.connecxguard.com/chatbot", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-Facility-Id": "t2y4sv_0954198_YRPC0QP",
//     },
//     body: JSON.stringify({
//       question: message,
//       schema_name: "facility_2",
//     }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`HTTP ${response.status}: ${errorText}`);
//   }

//   if (!response.body) {
//     throw new Error("No response body");
//   }

//   const reader = response.body.getReader();
//   const decoder = new TextDecoder();

//   try {
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) {
//         onComplete?.();
//         break;
//       }

//       const chunk = decoder.decode(value, { stream: true });

//       // Updated parsing logic to preserve spaces
//       const content = chunk
//         .split('\n')
//         .filter(line => line.startsWith('data:'))
//         .map(line => line.slice(6)) // Slice(6) to remove "data: ", don't trim to keep spaces
//         .join('');

//       if (content && content !== "[DONE]") {
//         onStreamChunk(content);
//       }
//     }
//   } catch (err) {
//     onError?.(err);
//   } finally {
//     reader.releaseLock();
//   }
// };