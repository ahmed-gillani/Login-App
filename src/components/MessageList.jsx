import React, { useEffect, useRef } from "react";
import Message from "./Message";

export default function MessageList({ messages = [], isThinking = false }) {
  const bottomRef = useRef(null);

  // Scroll to bottom on new messages or while streaming
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto px-0 md:px-6 pt-6 pb-6">
      <div className="mx-auto w-full max-w-3xl">
        {messages.length === 0 && !isThinking && (
          <div className="mt-20 text-center text-slate-500">
            <h3 className="text-lg font-medium">Welcome to Chat</h3>
            <p className="mt-2 text-sm">Ask anything — this chat is powered by your app.</p>
          </div>
        )}
        <div className="mt-4 space-y-2">
          {messages.map((m, index) => (
            <Message
              key={m.id}
              role={m.role}
              content={m.text}
              isThinking={isThinking && index === messages.length - 1 && m.role === "assistant"}
              isLastAssistant={index === messages.length - 1 && m.role === "assistant"}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
