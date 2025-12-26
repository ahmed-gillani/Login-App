//src/components/Message.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";

import userAvatar from "../assets/user.gif";
import gptAvatar from "../assets/gpt.gif";
import { cleanText } from "../utils/cleanText";

export default function Message({ role, content, isThinking = false }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const fixedContent = cleanText(content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fixedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {}
  };

  return (
    <div className="w-full px-6 py-3">
      <div className={`flex gap-4 items-start max-w-4xl ${isUser ? "ml-auto flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className="relative group">
          <img
            src={isUser ? userAvatar : gptAvatar}
            alt={isUser ? "You" : "Assistant"}
            className={`w-10 h-10 rounded-full object-cover ${!isUser && isThinking ? "animate-pulse" : ""}`}
          />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs px-2 py-1 rounded">
            {isUser ? "You" : "Assistant"}
          </span>
        </div>

        {/* Message */}
        <div className="flex-1">
          {!isUser && (
            <div className="flex justify-end mb-1">
              <button onClick={handleCopy} className="p-1 rounded hover:bg-slate-100 text-slate-500">
                {copied ? <Check size={14}/> : <Copy size={14}/>}
              </button>
            </div>
          )}

          {!isUser ? (
            <div className="prose prose-slate max-w-none leading-relaxed">
              <ReactMarkdown
                components={{
                  ul({ children }) { return <ul className="list-disc pl-6 space-y-2">{children}</ul>; },
                  li({ children }) { return <li className="leading-relaxed">{children}</li>; },
                  p({ children }) { return <p className="mb-4">{children}</p>; },
                }}
              >
                {fixedContent}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="bg-slate-700 text-white px-4 py-2 rounded-xl max-w-sm ml-auto">
              {fixedContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
