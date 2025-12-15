import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";

import userAvatar from "../assets/user.gif";
import gptAvatar from "../assets/gpt.gif";

export default function Message({ role, content, isThinking = false }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  // 🔹 CLEAN & NORMALIZE TEXT
 function cleanText(input) {
  if (!input) return "";

  let text = input;

  // Remove streaming junk
  text = text.replace(/data:\s*/gi, "");

  // Fix abbreviations
  const fixes = {
    "S N F": "SNF",
    "S N F s": "SNFs",
    "R N": "RN",
    "L P N": "LPN",
    "C N A": "CNA",
    "C N A s": "CNAs",
    "P T": "PT",
    "O T": "OT",
    "S L P": "SLP",
  };

  Object.entries(fixes).forEach(([k, v]) => {
    const r = new RegExp(`\\b${k.replace(/ /g, "\\s*")}\\b`, "gi");
    text = text.replace(r, v);
  });

  // ✅ Fix broken hyphenated words (post - acute → post-acute)
  text = text.replace(/(\w)\s*-\s*(\w)/g, "$1-$2");

  // ✅ Ensure space after comma
  text = text.replace(/,([^\s])/g, ", $1");

  // ✅ ONLY convert ".-" into bullet point
  text = text.replace(/\.\s*-\s*/g, ".\n\n• ");

  // ✅ Clean extra spaces
  text = text
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    .trim();

  return text;
}


  const fixedContent = cleanText(
    typeof content === "string" ? content : String(content)
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fixedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {}
  };

  return (
    <div className="w-full px-6 py-3">
      <div
        className={`flex gap-4 items-start max-w-4xl ${
          isUser ? "ml-auto flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div className="relative group">
          <img
            src={isUser ? userAvatar : gptAvatar}
            alt={isUser ? "You" : "Assistant"}
            className={`w-10 h-10 rounded-full object-cover
              ${!isUser && isThinking ? "animate-pulse" : ""}
            `}
          />

          {/* Tooltip */}
          <span
            className="absolute -bottom-8 left-1/2 -translate-x-1/2
            opacity-0 group-hover:opacity-100 transition
            bg-black text-white text-xs px-2 py-1 rounded"
          >
            {isUser ? "You" : "Assistant"}
          </span>
        </div>

        {/* Message */}
        <div className="flex-1">
          {!isUser && (
            <div className="flex justify-end mb-1">
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-slate-100 text-slate-500"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          )}

          {/* Assistant = document style */}
          {!isUser ? (
            <div className="prose prose-slate max-w-none leading-relaxed">
              <ReactMarkdown
                components={{
                  ul({ children }) {
                    return (
                      <ul className="list-disc pl-6 space-y-2">{children}</ul>
                    );
                  },
                  li({ children }) {
                    return <li className="leading-relaxed">{children}</li>;
                  },
                  p({ children }) {
                    return <p className="mb-4">{children}</p>;
                  },
                }}
              >
                {fixedContent}
              </ReactMarkdown>
            </div>
          ) : (
            // User bubble
            <div className="bg-slate-700 text-white px-4 py-2 rounded-xl max-w-sm ml-auto">
              {fixedContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
