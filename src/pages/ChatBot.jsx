// src/pages/ChatBot.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";    // 🔹 ADD THIS
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import Footer from "../components/Footer";
import { sendChatMessage } from "../api/chatApi";

export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);

    const navigate = useNavigate();  // 🔹 Navigator

    const handleSend = async (text) => {
        const userMsg = { id: Date.now(), role: "user", text };
        setMessages((prev) => [...prev, userMsg]);
        setIsThinking(true);

        const botMsgId = Date.now() + 1;
        const botMsg = { id: botMsgId, role: "assistant", text: "" };
        setMessages((prev) => [...prev, botMsg]);

        try {
            await sendChatMessage(text, (streamedText) => {
                // Update bot message in real-time as chunks arrive
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === botMsgId ? { ...msg, text: streamedText } : msg
                    )
                );
            });
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                role: "assistant",
                text: "Error: Unable to connect to the API. Please try again.",
            };
            setMessages((prev) => [...prev, errorMsg]);
            console.error("Error sending message:", error);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">

            {/* 🔙 BACK BUTTON  */}
            {/* Floating Back Button (TOP-LEFT) */}
            <button
                onClick={() => navigate("/dashboard")}
                className="absolute top-4 left-4 z-50 
             bg-gray-900 text-white w-11 h-11 rounded-full 
             flex items-center justify-center text-lg shadow-lg
             hover:bg-gray-800 active:scale-95 duration-150">
                ←
            </button>


            <Sidebar
                conversations={[]}
                activeId={null}
                onSelect={() => { }}
                onNewChat={() => setMessages([])}
                onDelete={() => { }}
                onSelectOption={() => { }}
            />

            <div className="flex flex-col flex-1">
                <Header />
                <div className="flex-1 overflow-hidden flex flex-col items-center">
                    <div className="w-full max-w-4xl h-full flex flex-col">
                        <MessageList messages={messages} isThinking={isThinking} />
                        <Footer onSend={handleSend} isStreaming={isThinking} />
                    </div>
                </div>
            </div>
        </div>
    );
}
