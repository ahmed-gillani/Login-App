// src/utils/chatTitle.js
import { cleanText } from "./cleanText";

/**
 * Generate a clean, concise chat title from the first part of the message
 * @param {string} text - The message text
 * @returns {string} - Short chat title
 */
export const generateChatTitle = (text) => {
  if (!text) return "New Chat";

  // Clean the text first to fix broken words, acronyms, spacing
  const cleaned = cleanText(text);

  // Take first 6 words for the title
  const title = cleaned
    .split(/\s+/)              // Split by spaces
    .slice(0, 6)               // Take first 6 words
    .join(" ")                  // Join back to a string
    .replace(/^./, (c) => c.toUpperCase()); // Capitalize first letter

  return title || "New Chat";
};
