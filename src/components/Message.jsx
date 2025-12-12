// src/components/Message.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";

export default function Message({ role, content }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

 function cleanText(input) {
  if (!input) return "";

  let text = input;

  // 1) Remove accidental "data:"
  text = text.replace(/data:\s*/gi, "");

  // 2) Fix spaced abbreviations: S N F → SNF
  text = text.replace(/\b(S\s*N\s*F)\b/gi, "SNF");
    text = text.replace(/\b(S\s*N\s*F\s*s)\b/gi, "SNFs");

  text = text.replace(/\b(R\s*N)\b/gi, "RN");
  text = text.replace(/\b(L\s*P\s*N)\b/gi, "LPN");
  text = text.replace(/\b(C\s*N\s*A)\b/gi, "CNA");
    text = text.replace(/\b(C\s*N\s*A\s*s)\b/gi, "CNAs");
  text = text.replace(/\b(P\s*T)\b/gi, "PT");
  text = text.replace(/\b(O\s*T)\b/gi, "OT");
  text = text.replace(/\b(S\s*L\s*P)\b/gi, "SLP");

  // 3) Fix parentheses: ( S N F ) → (SNF)
  // 3) Fix parentheses: ( S N F ) or ( S N F s ) → (SNF) / (SNFs)
  text = text.replace(/\(\s*([A-Za-z]\s*[A-Za-z]\s*[A-Za-z](?:\s*[sS])?)\s*\)/gi,
    (_, m) => "(" + m.replace(/\s+/g, "") + ")"
  );

  // 4) Remove hyphens used as sentence prefixes
  text = text.replace(/\s*-\s*/g, " ");

  // 5) Remove spaces before punctuation
  text = text.replace(/\s+([.,!?])/g, "$1");

  // 6) Split sentences into separate paragraphs (double newline)
  // Insert paragraph breaks after sentence-ending punctuation even when the
  // streamed chunks don't include a space or newline after the punctuation.
  // Avoid adding breaks when punctuation is already followed by a newline.
  text = text.replace(/([.!?])(?=[^\n])/g, "$1\n\n");

  // 7) Clean extra spaces but preserve newlines.
  // Only collapse repeated spaces and tabs, do NOT collapse newlines inserted above.
  text = text.replace(/[ \t]{2,}/g, " ");
  // Trim leading/trailing spaces on each line while keeping paragraph breaks
  text = text
    .split('\n')
    .map((line) => line.replace(/^ +| +$/g, ""))
    .join('\n')
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
    } catch (e) {}
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} px-4 py-2`}>
      <div className={`flex max-w-[90%] md:max-w-[760px] gap-3 items-start ${isUser ? "flex-row-reverse" : ""}`}>

        {/* Avatar */}
        {!isUser ? (
          <div className="w-10 h-10 rounded-md bg-gray-800 text-white flex items-center justify-center font-bold">
            GPT
          </div>
        ) : (
          <div className="w-10 h-10 rounded-md bg-blue-600 text-white flex items-center justify-center font-semibold">
            U
          </div>
        )}

        {/* Chat Bubble */}
        <div
          className={`${
            isUser
              ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white"
              : "bg-white/90 border border-white/30 backdrop-blur"
          } rounded-2xl px-4 py-3 shadow-sm prose prose-sm max-w-full leading-relaxed`}
        >

          {/* Copy Button */}
          {!isUser && (
            <div className="flex justify-end -mt-2 -mr-2">
              <button onClick={handleCopy} className="p-1 rounded text-gray-500 hover:bg-gray-100/60">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          )}

          {/* Markdown Viewer */}
          <ReactMarkdown
            components={{
              code({ inline, children }) {
                if (!inline) {
                  return (
                    <pre className="bg-slate-900 text-white p-4 rounded-lg overflow-auto">
                      <code>{children}</code>
                    </pre>
                  );
                }
                return (
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                );
              },
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    className="text-sky-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {children}
                  </a>
                );
              }
            }}
          >
            {fixedContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
