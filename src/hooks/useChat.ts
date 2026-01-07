import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../api/chatApi.ts";

interface SendChatPayload {
  message: string;
  onStreamChunk?: (chunk: string) => void;
  onComplete?: () => void;
}

export const useSendChatMessage = () => {
  return useMutation<void, Error, SendChatPayload>({
    mutationFn: sendChatMessage,
    onError: (error) => {
      console.error("Chat error:", error.message);
    },
  });
};
