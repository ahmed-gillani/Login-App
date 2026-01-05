// src/api/messageApi.ts
export const fetchMessageDetails = async (
  messageId: string | number
): Promise<{ note?: string }> => {
  const response = await fetch(`https://your-api.com/messages/${messageId}`);
  if (!response.ok) throw new Error("Failed to fetch message details");
  return response.json(); // TS now knows it returns { note?: string }
};
