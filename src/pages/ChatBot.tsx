import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar.tsx";
import MessageList from "../components/MessageList.tsx";
import Footer from "../components/Footer.tsx";
import { useSendChatMessage } from "../hooks/useChat.ts";
import { getChats, createChat, updateChat, deleteChat } from "../utils/chatStorage.ts";
import { processChunk } from "../utils/processChunk.ts";

export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt?: number;
}

export default function ChatBot() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [chatTitle, setChatTitle] = useState("New Chat");

  const fullResponse = useRef<string>("");

  const { mutateAsync: sendMessage } = useSendChatMessage();

  useEffect(() => {
    const chats = getChats();
    const chatIds = Object.keys(chats);

    if (chatIds.length === 0) {
      const newId = createChat();
      navigate(`/chatbot/${newId}`, { replace: true });
      return;
    }

    if (id && chats[id]) {
      setActiveId(id);
      const chat = chats[id];
      setMessages(chat.messages || []);
      setChatTitle(chat.title || "New Chat");
    } else {
      navigate(`/chatbot/${chatIds[0]}`, { replace: true });
    }

    setConversations(Object.values(chats));
  }, [id, navigate]);

  const finalizeResponse = (text: string): string => {
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

  const handleSend = async (text: string) => {
    if (!activeId || !text.trim()) return;

    const chats = getChats();
    const chat = chats[activeId];
    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
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
        onStreamChunk: (rawChunk: string) => {
          processChunk(rawChunk, (token: string) => {
            fullResponse.current += token;
            const currentChats = getChats();
            const currentChat = currentChats[activeId];
            if (!currentChat) return;

            let botMsg = currentChat.messages.find((m) => m.id === botId);
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
          const botMsg = currentChat.messages.find((m) => m.id === botId);
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
      const errorMsg: Message = {
        id: Date.now() + 2,
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
      };
      chat.messages.push(errorMsg);
      updateChat(activeId, chat);
      setMessages([...chat.messages]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleNewChat = () => {
    const newId = createChat();
    setConversations(Object.values(getChats()));
    navigate(`/chatbot/${newId}`);
  };

  const handleDelete = (cid: string) => {
    deleteChat(cid);
    const chats = getChats();
    const ids = Object.keys(chats);

    if (cid === activeId) {
      const newId = ids.length ? ids[0] : createChat();
      navigate(`/chatbot/${newId}`, { replace: true });
    }

    setConversations(Object.values(chats));
  };

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
