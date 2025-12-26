export const generateChatTitle = (text) => {
  if (!text) return "New Chat";
  return text
    .replace(/[\n\r]/g, " ")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .split(" ")
    .slice(0, 6)
    .join(" ")
    .replace(/^./, (c) => c.toUpperCase());
};
