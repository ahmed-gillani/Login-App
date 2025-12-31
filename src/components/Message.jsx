import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ReactTyped } from "react-typed";
import { Copy, Check } from "lucide-react";
import userAvatar from "../assets/user.gif";
import gptAvatar from "../assets/gpt.gif";
import { useMessageDetails } from "../hooks/useMessage"; // New hook

export default function Message({ role, content, isThinking = false, isLastAssistant = false, messageId }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typedBulletIndex, setTypedBulletIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Optional TanStack use in Message.jsx for fetching extra details
  const { data: messageDetails, isLoading: detailsLoading } = useMessageDetails(messageId);

  useEffect(() => {
    if (isLastAssistant && isThinking) {
      setIsTyping(true);
      setTypedBulletIndex(0);
      setDisplayText("");
    } else {
      setDisplayText(content || "");
      setIsTyping(false);
    }
  }, [isThinking, isLastAssistant, content]);

  const processTextWithBoldQuotes = (text) => {
    return text.replace(/"([^"]*)"/g, "**$1**");
  };

  const renderMessageContent = () => {
    const fullText = displayText || content || "";

    if (detailsLoading) return <p>Loading extra details...</p>; // Optional

    // Use messageDetails if needed (e.g., add metadata)
    const enhancedText = messageDetails ? `${fullText} (Details: ${messageDetails.note})` : fullText;

    if (isUser) {
      return (
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {enhancedText}
          </ReactMarkdown>
        </div>
      );
    }

    const bulletLines = enhancedText
      .split(/\s*-\s+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return (
      <div className="prose prose-slate max-w-none leading-relaxed text-slate-800 dark:text-slate-200">
        {bulletLines.length > 1 ? (
          <ul className="list-disc list-outside pl-8 space-y-4 my-6">
            {bulletLines.map((line, i) => (
              <li key={i} className="leading-relaxed">
                {isLastAssistant && isTyping ? (
                  i < typedBulletIndex ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {processTextWithBoldQuotes(line)}
                    </ReactMarkdown>
                  ) : i === typedBulletIndex ? (
                    <ReactTyped
                      strings={[processTextWithBoldQuotes(line)]}
                      typeSpeed={5}
                      backSpeed={0}
                      loop={false}
                      showCursor={false}
                      onComplete={() => {
                        if (i < bulletLines.length - 1) {
                          setTypedBulletIndex(i + 1);
                        }
                      }}
                    />
                  ) : (
                    ""
                  )
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {processTextWithBoldQuotes(line)}
                  </ReactMarkdown>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <>
            {isLastAssistant && isTyping ? (
              <ReactTyped
                strings={[processTextWithBoldQuotes(enhancedText)]}
                typeSpeed={5}
                backSpeed={0}
                loop={false}
                showCursor={false}
              />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {processTextWithBoldQuotes(enhancedText)}
              </ReactMarkdown>
            )}
          </>
        )}
      </div>
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {}
  };

  return (
    <div className="w-full px-6 py-3">
      <div className={`flex gap-4 items-start max-w-4xl ${isUser ? "ml-auto flex-row-reverse" : ""}`}>
        <div className="relative group">
          <img
            src={isUser ? userAvatar : gptAvatar}
            alt={isUser ? "You" : "Assistant"}
            className={`w-10 h-10 rounded-full object-cover ${!isUser && isThinking ? "animate-pulse" : ""}`}
          />
        </div>

        <div className="flex-1">
          {!isUser && (
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          )}

          <div className={`px-6 py-5 rounded-2xl shadow-sm bg-white dark:bg-slate-800 ${isUser ? "max-w-md ml-auto" : "max-w-3xl"}`}>
            {renderMessageContent()}
          </div>
        </div>
      </div>
    </div>
  );
}