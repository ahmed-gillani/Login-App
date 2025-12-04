// src/components/Message.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";

export default function Message({ role, content }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(typeof content === "string" ? content : JSON.stringify(content));
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} px-4 py-2`}>
      <div className={`flex max-w-[90%] md:max-w-[760px] gap-3 items-start ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        {!isUser ? (
          <div className="w-10 h-10 rounded-md bg-gray-800 text-white flex items-center justify-center font-bold">GPT</div>
        ) : (
          <div className="w-10 h-10 rounded-md bg-blue-600 text-white flex items-center justify-center font-semibold">U</div>
        )}

        {/* Bubble */}
        <div className={`${isUser ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white" : "bg-white/90 border border-white/30 backdrop-blur"} rounded-2xl px-4 py-3 shadow-sm prose prose-sm max-w-full`}>
          <div className="flex justify-end -mt-2 -mr-2">
            {!isUser && (
              <button onClick={handleCopy} className="p-1 rounded text-gray-500 hover:bg-gray-100/60">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
          </div>

          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const isMulti = className?.includes("language-");
                if (isMulti) {
                  return (
                    <pre className="bg-slate-900 text-white p-4 rounded-lg overflow-auto">
                      <code className={className}>{children}</code>
                    </pre>
                  );
                }
                return <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">{children}</code>;
              },
              a({ href, children }) {
                return <a href={href} className="text-sky-600 hover:underline" target="_blank" rel="noreferrer">{children}</a>;
              },
            }}
          >
            {typeof content === "string" ? content : String(content)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
