// src/components/Footer.jsx
import React, { useRef, useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

export default function Footer({ onSend, isStreaming }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return; // allow newline
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() || isStreaming) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="p-4 bg-transparent border-t border-white/30">
      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <div className="flex items-end gap-3 bg-white/90 backdrop-blur rounded-3xl px-4 py-3 shadow-md border border-white/40">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isStreaming ? "Assistant is typing..." : "Send a message... (Enter to send)"}
              className="flex-1 min-h-[40px] max-h-[160px] resize-none bg-transparent outline-none text-sm leading-5 placeholder-slate-400"
            />

            <button
              onClick={handleSend}
              disabled={!text.trim() || isStreaming}
              className={`ml-2 inline-flex items-center justify-center rounded-xl p-2 transition ${
                !text.trim() || isStreaming ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100"
              }`}
              aria-label="Send"
            >
              {isStreaming ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </div>

          <p className="mt-2 text-xs text-center text-slate-500">ChatGPT may produce inaccurate information — verify important details.</p>
        </div>
      </div>
    </div>
  );
}
