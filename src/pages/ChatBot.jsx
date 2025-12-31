import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
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

  const botMsgRef = useRef("");

  const { mutateAsync: sendMessage } = useSendChatMessage();

  useEffect(() => {
    const chats = getChats();
    if (!id) {
      const ids = Object.keys(chats);
      const newId = ids.length ? ids[0] : createChat();
      navigate(`/chatbot/${newId}`, { replace: true });
      return;
    }
    if (!chats[id]) {
      const newId = createChat();
      navigate(`/chatbot/${newId}`, { replace: true });
      return;
    }
    setActiveId(id);
    setMessages(chats[id].messages || []);
    setConversations(Object.values(chats).filter(c => c?.id));
  }, [id, navigate]);

  const handleSend = async (text) => {
    if (!activeId || !text.trim()) return;

    const chats = getChats();
    const chat = chats[activeId];
    if (!chat) return;

    const userMsg = { id: Date.now(), role: "user", text: text.trim() };
    chat.messages.push(userMsg);

    if (chat.messages.length === 1) {
      const words = text.trim().split(/\s+/).slice(0, 5).join(" ");
      chat.title = words ? words.charAt(0).toUpperCase() + words.slice(1) : "New Chat";
    }

    updateChat(activeId, chat);
    setMessages([...chat.messages]);
    setIsThinking(true);

    const botId = Date.now() + 1;
    botMsgRef.current = "";

    try {
      await sendMessage({
        message: text.trim(),
        onStreamChunk: (rawChunk) => {
          processChunk(rawChunk, (cleanText) => {
            // Smart space add — word breaking maximum fix
            if (botMsgRef.current && !botMsgRef.current.endsWith(" ") && !cleanText.startsWith(" ")) {
              botMsgRef.current += " ";
            }
            botMsgRef.current += cleanText;

            const currentChats = getChats();
            const currentChat = currentChats[activeId];
            if (!currentChat) return;

            let botMsg = currentChat.messages.find(m => m.id === botId);
            if (!botMsg) {
              botMsg = { id: botId, role: "assistant", text: "" };
              currentChat.messages.push(botMsg);
            }

            // Final display text with spacing
            botMsg.text = botMsgRef.current
              .replace(/\s*([.,:!?])\s*/g, "$1 ")
              .replace(/\s+/g, " ")
              .trim();

            updateChat(activeId, currentChat);
            setMessages([...currentChat.messages]);
          });
        },
      });
    } catch (err) {
      console.error("Chat API error:", err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleNewChat = () => {
    const newId = createChat();
    navigate(`/chatbot/${newId}`);
  };

  const handleDelete = (cid) => {
    deleteChat(cid);
    const chats = getChats();
    const ids = Object.keys(chats);
    if (cid === activeId) {
      const newId = ids.length ? ids[0] : createChat();
      navigate(`/chatbot/${newId}`, { replace: true });
    }
    setConversations(Object.values(chats).filter(c => c?.id));
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(cid) => navigate(`/chatbot/${cid}`)}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
      />
      <div className="flex flex-col flex-1">
        <Header title={conversations.find(c => c.id === activeId)?.title || "New Chat"} />
        <MessageList messages={messages} isThinking={isThinking} />
        <Footer onSend={handleSend} isStreaming={isThinking} />
      </div>
    </div>
  );
}