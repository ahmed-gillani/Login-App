// const KEY = "chat_conversations";

// export function getChats() {
//   return JSON.parse(localStorage.getItem(KEY)) || {};
// }

// export function saveChats(chats) {
//   localStorage.setItem(KEY, JSON.stringify(chats));
// }

// export function createChat() {
//   const chats = getChats();
//   const id = Date.now().toString();
//   chats[id] = {
//     id,
//     title: "New Chat",
//     messages: [],
//     createdAt: Date.now(),
//   };
//   saveChats(chats);
//   return id;
// }

// export function updateChat(id, data) {
//   const chats = getChats();
//   chats[id] = data;
//   saveChats(chats);
// }

// export function deleteChat(id) {
//   const chats = getChats();
//   delete chats[id];
//   saveChats(chats);
// }
// src/utils/chatStorage.js

const KEY = "chat_conversations";

// ---------------------- GET & SAVE ----------------------
export function getChats() {
  return JSON.parse(localStorage.getItem(KEY)) || {};
}

export function saveChats(chats) {
  localStorage.setItem(KEY, JSON.stringify(chats));
}

// ---------------------- CREATE ----------------------
export function createChat() {
  const chats = getChats();
  const chatIds = Object.keys(chats);

  // If no chats exist, create 1 new chat
  if (chatIds.length === 0) {
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

  // Otherwise return the first existing chat ID
  return chatIds[0];
}

// ---------------------- UPDATE ----------------------
export function updateChat(id, data) {
  const chats = getChats();
  chats[id] = data;
  saveChats(chats);
}

// ---------------------- DELETE ----------------------
export function deleteChat(id) {
  const chats = getChats();
  delete chats[id];
  saveChats(chats);
}
