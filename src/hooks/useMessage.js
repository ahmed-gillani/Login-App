// src/hooks/useMessage.js
import { useQuery } from "@tanstack/react-query";
import { fetchMessageDetails } from "../api/messageApi";

export const useMessageDetails = (messageId) => {
  return useQuery({
    queryKey: ["message", messageId],
    queryFn: () => fetchMessageDetails(messageId),
    enabled: !!messageId,
    staleTime: 5 * 60 * 1000,
  });
};