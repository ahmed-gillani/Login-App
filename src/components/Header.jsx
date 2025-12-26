//src/components/Header.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Share2, UserPlus, MoreVertical } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  const showBack = location.pathname.startsWith("/chatbot");

  return (
    <header className="w-full relative">
      <div className="flex items-center justify-between px-6 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Back to dashboard"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Chatbot</h1>
        </div>

        <div className="flex items-center gap-2 relative">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Share chat"><Share2 size={18} /></button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Add people"><UserPlus size={18} /></button>
          <button onClick={() => setOpenMenu(p => !p)} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="More options"><MoreVertical size={18} /></button>

          {openMenu && (
            <div className="absolute right-0 top-12 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700">Rename chat</button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700">Clear messages</button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40">Delete chat</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
