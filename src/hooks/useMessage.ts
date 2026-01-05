import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchMessageDetails } from "../api/messageApi.ts";

export interface MessageDetails {
  note?: string;
}

export const useMessageDetails = (
  messageId?: string | number
): UseQueryResult<MessageDetails, unknown> => {
  return useQuery<MessageDetails>({
    queryKey: ["message", messageId],
    queryFn: () => fetchMessageDetails(messageId!),
    enabled: Boolean(messageId),
    staleTime: 5 * 60 * 1000,
  });
};
