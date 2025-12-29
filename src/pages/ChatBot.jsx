import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import Footer from "../components/Footer";
import { useSendChatMessage } from "../hooks/useChat";
import { getChats, createChat, updateChat, deleteChat } from "../utils/chatStorage";
import { generateChatTitle } from "../utils/chatTitle";
import { cleanText } from "../utils/cleanText";

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
    if (!activeId || !text) return;

    const chats = getChats();
    const chat = chats[activeId];
    if (!chat) return;

    const userMsg = { id: Date.now(), role: "user", text };
    chat.messages.push(userMsg);
    if (chat.messages.length === 1) chat.title = generateChatTitle(text);
    updateChat(activeId, chat);
    setMessages([...chat.messages]);
    setIsThinking(true);

    const botId = Date.now() + 1;
    botMsgRef.current = "";

    try {
      await sendMessage({
        message: text,
        onStreamChunk: (chunk) => {
          botMsgRef.current += (botMsgRef.current ? " " : "") + chunk;
          const fixedText = cleanText(botMsgRef.current);

          const chats = getChats();
          const chat = chats[activeId];
          if (!chat) return;

          let botMsg = chat.messages.find(m => m.id === botId);
          if (!botMsg) {
            botMsg = { id: botId, role: "assistant", text: "" };
            chat.messages.push(botMsg);
          }

          botMsg.text = fixedText;
          updateChat(activeId, chat);
          setMessages([...chat.messages]);
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
        <Header title={conversations.find(c => c.id === activeId)?.title} />
        <MessageList messages={messages} isThinking={isThinking} />
        <Footer onSend={handleSend} isStreaming={isThinking} />
      </div>
    </div>
  );
}
