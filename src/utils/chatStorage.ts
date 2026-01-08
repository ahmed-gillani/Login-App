// src/utils/chatStorage.ts
import { Chat } from "../pages/ChatBot";

const KEY = "chat_conversations";

export function getChats(): Record<string, Chat> {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : {};
}

export function saveChats(chats: Record<string, Chat>) {
  localStorage.setItem(KEY, JSON.stringify(chats));
}

export function createChat(): string {
  const chats = getChats();
  const id = Date.now().toString();

  chats[id] = {
    id,
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
  };

  saveChats(chats);
  return id;
}

export function updateChat(id: string, data: Chat) {
  const chats = getChats();
  if (chats[id]) {
    chats[id] = data;
    saveChats(chats);
  }
}

export function deleteChat(id: string) {
  const chats = getChats();
  delete chats[id];
  saveChats(chats);
}

export function clearAllChats() {
  localStorage.removeItem(KEY);
}