
// src/components/Footer.jsx
import React, { useRef, useState, useEffect } from "react";
import { Send } from "lucide-react";

export default function Footer({ onSend, isStreaming = false }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize (optional - keeps it clean)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Simple Input Bar - Exactly like your screenshot */}
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-full px-6 py-4 shadow-sm">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Send a message..."
            className="flex-1 resize-none bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 text-base"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || isStreaming}
            className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}