const KEY = "chat_conversations";

export function getChats() {
  return JSON.parse(localStorage.getItem(KEY)) || {};
}

export function saveChats(chats) {
  localStorage.setItem(KEY, JSON.stringify(chats));
}

export function createChat() {
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

export function updateChat(id, data) {
  const chats = getChats();
  chats[id] = data;
  saveChats(chats);
}

export function deleteChat(id) {
  const chats = getChats();
  delete chats[id];
  saveChats(chats);
}
