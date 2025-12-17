import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import Footer from "../components/Footer";
import { sendChatMessage } from "../api/chatApi";
import {
    getChats,
    createChat,
    updateChat,
    deleteChat,
} from "../utils/chatStorage";
import { generateChatTitle } from "../utils/chatTitle";

export default function ChatBot() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);

    // 🔹 Load chats on mount / URL change
    useEffect(() => {
  const chats = getChats();

  // ✅ Only create chat if NO chat exists at all
  if (!id) {
    const ids = Object.keys(chats);

    if (ids.length === 0) {
      const newId = createChat();
      navigate(`/chatbot/${newId}`, { replace: true });
    } else {
      navigate(`/chatbot/${ids[0]}`, { replace: true });
    }
    return;
  }

  if (!chats[id]) return;

  setActiveId(id);
  setMessages(chats[id].messages);
  setConversations(
    Object.values(chats).filter((c) => c?.id)
  );
}, [id]);


    // 🔹 Send message
    const handleSend = async (text) => {
        if (!activeId) return;

        const chats = getChats();
        const chat = chats[activeId];

        const userMsg = { id: Date.now(), role: "user", text };
        chat.messages.push(userMsg);

        // Set title from first message
        if (chat.messages.length === 1) {
            chat.title = generateChatTitle(text);
        }

        updateChat(activeId, chat);
        setMessages([...chat.messages]);
        setIsThinking(true);

        let botId = Date.now() + 1;

        try {
            await sendChatMessage(text, (chunk) => {
                const chats = getChats();
                const chat = chats[activeId];

                let botMsg = chat.messages.find((m) => m.id === botId);
                if (!botMsg) {
                    botMsg = { id: botId, role: "assistant", text: "" };
                    chat.messages.push(botMsg);
                }

                botMsg.text = chunk;
                updateChat(activeId, chat);
                setMessages([...chat.messages]);
            });
        } finally {
            setIsThinking(false);
        }
    };

    // 🔹 New chat
    const handleNewChat = () => {
        const newId = createChat();
        navigate(`/chatbot/${newId}`);
    };

    // 🔹 Delete chat
    const handleDelete = (cid) => {
        deleteChat(cid);
        const chats = getChats();
        const ids = Object.keys(chats);

        if (cid === activeId) {
            if (ids.length === 0) {
                const newId = createChat();
                navigate(`/chatbot/${newId}`, { replace: true });
            } else {
                navigate(`/chatbot/${ids[0]}`, { replace: true });
            }
        }

        setConversations(
            Object.values(chats).filter((c) => c?.id)
        );
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                conversations={conversations}
                activeId={activeId}
                onSelect={(cid) => navigate(`/chatbot/${cid}`)}
                onNewChat={handleNewChat}
                onDelete={handleDelete}
                onSelectOption={() => { }}
            />

            <div className="flex flex-col flex-1">
                <Header title={conversations.find(c => c.id === activeId)?.title} />
                <MessageList messages={messages} isThinking={isThinking} />
                <Footer onSend={handleSend} isStreaming={isThinking} />
            </div>
        </div>
    );
}
