// src/components/Message.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ReactTyped } from "react-typed";
import { Copy, Check } from "lucide-react";

import { useMessageDetails, MessageDetails } from "../hooks/useMessage.ts";

import userAvatar from "../assets/user-avatar.png";
import botAvatar from "../assets/bot-avatar.png";
/* -------------------- Types -------------------- */

export type MessageRole = "user" | "assistant";

interface MessageProps {
  role: MessageRole;
  content?: string;
  isThinking?: boolean;
  isLastAssistant?: boolean;
  messageId?: string | number;
  onSend: (text: string) => void;
}

/* -------------------- Component -------------------- */

const Message: React.FC<MessageProps> = ({
  role,
  content,
  isThinking = false,
  isLastAssistant = false,
  messageId,
  onSend,
}) => {
  const isUser = role === "user";

  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typedBulletIndex, setTypedBulletIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const { data: messageDetails } = useMessageDetails(messageId);

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    if (isLastAssistant && isThinking) {
      setIsTyping(true);
      setTypedBulletIndex(0);
      setDisplayText("");
    } else {
      setDisplayText(content ?? "");
      setIsTyping(false);
    }
  }, [isThinking, isLastAssistant, content]);

  /* -------------------- Helpers -------------------- */
  const processTextWithBoldQuotes = (text: string): string => {
    return text.replace(/"([^"]*)"/g, "**$1**");
  };

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content || displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  /* -------------------- Derived Data -------------------- */
  const fullText = displayText || content || "";

  const enhancedText = messageDetails?.note
    ? `${fullText}\n\n*(Note: ${messageDetails.note})*`
    : fullText;

  const bulletLines = enhancedText
    .split(/\n-\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const followUpSuggestions: string[] = [
    "Tell me more",
    "Give examples",
    "Related policies",
    "Simplify this",
  ];

  /* -------------------- Render Content -------------------- */
  const renderContent = () => {
    if (isUser) {
      return (
        <div className="leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {enhancedText}
          </ReactMarkdown>
        </div>
      );
    }

    if (bulletLines.length > 1) {
      return (
        <ul className="space-y-4 pl-1 my-4">
          {bulletLines.map((line, i) => (
            <li key={i} className="flex">
              <span className="mr-3 text-blue-600 dark:text-blue-400 font-bold text-lg">
                •
              </span>
              <div className="flex-1 leading-relaxed">
                {isLastAssistant && isTyping ? (
                  i < typedBulletIndex ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {processTextWithBoldQuotes(line)}
                    </ReactMarkdown>
                  ) : i === typedBulletIndex ? (
                    <ReactTyped
                      strings={[processTextWithBoldQuotes(line)]}
                      typeSpeed={15}
                      showCursor
                      cursorChar="▋"
                      onStringTyped={() => {
                        if (i < bulletLines.length - 1) {
                          setTimeout(() => setTypedBulletIndex(i + 1), 150);
                        }
                      }}
                    />
                  ) : null
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {processTextWithBoldQuotes(line)}
                  </ReactMarkdown>
                )}
              </div>
            </li>
          ))}
        </ul>
      );
    }

    return isLastAssistant && isTyping ? (
      <ReactTyped
        strings={[processTextWithBoldQuotes(enhancedText)]}
        typeSpeed={15}
        showCursor
        cursorChar="▋"
      />
    ) : (
      <div className="leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {processTextWithBoldQuotes(enhancedText)}
        </ReactMarkdown>
      </div>
    );
  };

  /* -------------------- JSX -------------------- */
  return (
    <div className="group py-6 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
      <div
        className={`flex gap-5 items-start max-w-4xl mx-auto ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        {!isUser && (
          <div className="shrink-0">
            <img
              src={botAvatar}
              alt="Assistant"
              className={`w-11 h-11 rounded-full border-2 shadow-md border-gray-300 dark:border-gray-600 ${
                isThinking ? "animate-pulse" : ""
              }`}
            />
          </div>
        )}

        <div className={isUser ? "max-w-lg" : "flex-1 w-full max-w-3xl"}>
          <div
            className={`relative px-6 py-4 rounded-3xl shadow-lg inline-block ${
              isUser
                ? "bg-blue-600 text-white rounded-tr-none min-w-[80px]"
                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-none w-full"
            }`}
          >
            <div
              className={`absolute top-0 w-4 h-4 transform ${
                isUser
                  ? "right-0 translate-x-1/2 -rotate-45 bg-blue-600"
                  : "left-0 -translate-x-1/2 rotate-45 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700"
              }`}
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            />

            <div className="prose prose-sm dark:prose-invert max-w-none">
              {renderContent()}
            </div>

            <div
              className={`text-xs mt-3 ${
                isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
              } opacity-70 text-right`}
            >
              {currentTime}
            </div>

            {!isUser && !isThinking && (
              <div className="mt-6 flex flex-wrap gap-3">
                {followUpSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSend(suggestion)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {!isUser && !isThinking && (
              <button
                onClick={handleCopy}
                className="absolute -top-10 right-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Copy message"
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0">
            <img
              src={userAvatar}
              alt="You"
              className="w-11 h-11 rounded-full border-2 shadow-md border-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;