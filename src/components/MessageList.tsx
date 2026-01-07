import React, { useEffect, useRef } from "react";
import Message from "./Message.tsx";

export interface MessageItem {
  id: string | number;
  role: "user" | "assistant";
  text: string;
}

interface MessageListProps {
  messages?: MessageItem[];
  isThinking?: boolean;
  onSend: (msg: string) => void;
}

export default function MessageList({ messages = [], isThinking = false, onSend }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const suggestedPrompts = [
    "What is a Skilled Nursing Facility?",
    "Explain SNF Medicare regulations",
    "How to improve patient care in SNF?",
    "Common SNF compliance issues",
    "What services does an SNF provide?",
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {messages.length === 0 && !isThinking && (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              AI
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How can I assist you today?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Ask anything about Skilled Nursing Facilities (SNF), policies, regulations, or healthcare questions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSend(prompt)}
                  className="text-left p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl transition-all duration-300 text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <Message
            key={msg.id}
            role={msg.role}
            content={msg.text}
            isThinking={isThinking && msg.role === "assistant"}
            isLastAssistant={msg.role === "assistant" && messages[messages.length - 1].id === msg.id}
            onSend={onSend}
          />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
