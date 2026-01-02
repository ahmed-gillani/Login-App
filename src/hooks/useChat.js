// src/hooks/useChat.js
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../api/chatApi";

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: sendChatMessage,
    onError: (error) => {
      console.error("Chat error:", error.message);
    },
  });
};