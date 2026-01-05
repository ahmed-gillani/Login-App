// src/pages/ChatBot.jsx
import React, { useEffect, useState, useRef } from "react";  
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar.tsx"; 
import MessageList from "../components/MessageList";
import Footer from "../components/Footer";
import { useSendChatMessage } from "../hooks/useChat";
import { getChats, createChat, updateChat, deleteChat } from "../utils/chatStorage";
import { processChunk } from "../utils/processChunk";

export default function ChatBot() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [chatTitle, setChatTitle] = useState("New Chat");

  const fullResponse = useRef("");

  const { mutateAsync: sendMessage } = useSendChatMessage();

  // ---------------------- MAIN EFFECT ----------------------
  useEffect(() => {
    const chats = getChats();
    const chatIds = Object.keys(chats);

    // If no chats exist, create 1 new chat
    if (chatIds.length === 0) {
      const newId = createChat();
      navigate(`/chatbot/${newId}`, { replace: true });
      return;
    }

    // If route ID exists and valid
    if (id && chats[id]) {
      setActiveId(id);
      const chat = chats[id];
      setMessages(chat.messages || []);
      setChatTitle(chat.title || "New Chat");
    } 
    // If route ID missing or invalid, redirect to first chat
    else {
      navigate(`/chatbot/${chatIds[0]}`, { replace: true });
    }

    setConversations(Object.values(chats));
  }, [id, navigate]);

  // ---------------------- HELPER ----------------------
  const finalizeResponse = (text) => {
    return text
      .replace(/\.\s*-\s*/g, ".\n- ")
      .replace(/^\s*-\s*/g, "- ")
      .replace(/[ \t]+/g, " ")
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s*\(\s*/g, " (")
      .replace(/\s*\)\s*/g, ") ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  // ---------------------- SEND MESSAGE ----------------------
  const handleSend = async (text) => {
    if (!activeId || !text.trim()) return;

    const chats = getChats();
    const chat = chats[activeId];
    const userMsg = { id: Date.now(), role: "user", text: text.trim() };
    chat.messages.push(userMsg);

    if (chat.messages.length === 1) {
      const words = text.trim().split(/\s+/).slice(0, 6).join(" ");
      chat.title = words ? words.charAt(0).toUpperCase() + words.slice(1) : "New Chat";
      setChatTitle(chat.title);
    }

    updateChat(activeId, chat);
    setMessages([...chat.messages]);
    setIsThinking(true);

    const botId = Date.now() + 1;
    fullResponse.current = "";

    try {
      await sendMessage({
        message: text.trim(),
        onStreamChunk: (rawChunk) => {
          processChunk(rawChunk, (token) => {
            fullResponse.current += token;
            const currentChats = getChats();
            const currentChat = currentChats[activeId];
            if (!currentChat) return;

            let botMsg = currentChat.messages.find(m => m.id === botId);
            if (!botMsg) {
              botMsg = { id: botId, role: "assistant", text: "" };
              currentChat.messages.push(botMsg);
            }

            botMsg.text = fullResponse.current.replace(/[ \t]+/g, " ");
            updateChat(activeId, currentChat);
            setMessages([...currentChat.messages]);
          });
        },
        onComplete: () => {
          const finalText = finalizeResponse(fullResponse.current);
          const currentChats = getChats();
          const currentChat = currentChats[activeId];
          const botMsg = currentChat.messages.find(m => m.id === botId);
          if (botMsg) {
            botMsg.text = finalText;
            updateChat(activeId, currentChat);
            setMessages([...currentChat.messages]);
          }
          fullResponse.current = finalText;
        },
      });
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = { 
        id: Date.now() + 2, 
        role: "assistant", 
        text: "Sorry, something went wrong. Please try again." 
      };
      chat.messages.push(errorMsg);
      updateChat(activeId, chat);
      setMessages([...chat.messages]);
    } finally {
      setIsThinking(false);
    }
  };

  // ---------------------- NEW CHAT ----------------------
  const handleNewChat = () => {
    const newId = createChat();      // create a new chat in localStorage
    setConversations(Object.values(getChats())); // update sidebar immediately
    navigate(`/chatbot/${newId}`);   // navigate to new chat
  };

  // ---------------------- DELETE CHAT ----------------------
  const handleDelete = (cid) => {
    deleteChat(cid);
    const chats = getChats();
    const ids = Object.keys(chats);

    if (cid === activeId) {
      const newId = ids.length ? ids[0] : createChat();
      navigate(`/chatbot/${newId}`, { replace: true });
    }

    setConversations(Object.values(chats));
  };

  // ---------------------- RENDER ----------------------
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(cid) => navigate(`/chatbot/${cid}`)}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
      />
      <div className="flex flex-col flex-1">
        <Header title={chatTitle} />
        <MessageList messages={messages} isThinking={isThinking} onSend={handleSend} />
        <Footer onSend={handleSend} isStreaming={isThinking} />
      </div>
    </div>
  );
}
