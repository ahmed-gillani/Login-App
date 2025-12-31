// src/hooks/useMessage.js
import { useQuery } from "@tanstack/react-query";

export const useMessageDetails = (messageId) => {
  return useQuery({
    queryKey: ["message", messageId],
    queryFn: async () => {
      const response = await fetch(`https://your-api.com/messages/${messageId}`);
      if (!response.ok) throw new Error("Failed to fetch message details");
      return response.json();
    },
    enabled: !!messageId, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000, // Cache for 5 mins
  });
};