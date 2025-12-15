import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Plus,
  Search,
  BookOpen,
  Folder,
  MessageSquare,
  Trash2,
} from "lucide-react";

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onSelectOption,
}) {
  const [openMobile, setOpenMobile] = useState(false);

  // 🌙 Theme State
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {/* Mobile button */}
      <button
        className="md:hidden p-2 fixed top-3 left-3 z-[60] bg-white dark:bg-slate-800 rounded shadow"
        onClick={() => setOpenMobile(true)}
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {openMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full
          bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
          border-r border-slate-200 dark:border-slate-700
          shadow-lg z-50 w-64 flex flex-col
          transition-transform duration-300
          ${openMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold">
              AI
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
              ChatGPT
            </span>
          </div>

          {/* Close on mobile */}
          {openMobile && (
            <button
              onClick={() => setOpenMobile(false)}
              className="md:hidden p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onSelectOption(null);
              setOpenMobile(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
            bg-slate-100 dark:bg-slate-800
            text-slate-700 dark:text-slate-300
            hover:bg-slate-200 dark:hover:bg-slate-700 
            transition"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Menu */}
        <div className="p-3 space-y-1">
          <SidebarItem
            key="search"
            icon={<Search size={18} />}
            label="Search"
            onClick={() => onSelectOption("search")}
          />

          <SidebarItem
            icon={<BookOpen size={18} />}
            label="Library"
            onClick={() => onSelectOption("library")}
          />
          <SidebarItem
            icon={<Folder size={18} />}
            label="Projects"
            onClick={() => onSelectOption("projects")}
          />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 mt-2 space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id || `chat-${conv.createdAt}`}
              onClick={() => conv?.id && onSelect(conv.id)}
              className={`
      flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition 
      ${conv.id === activeId
                  ? "bg-blue-100 border border-blue-300 dark:bg-blue-900/40 dark:border-blue-700"
                  : "hover:bg-slate-200 dark:hover:bg-slate-800"
                }
    `}
            >

              <div className="flex items-center gap-3">
                <MessageSquare size={16} className="text-slate-600 dark:text-slate-300" />
                <span className="text-sm text-slate-800 dark:text-slate-300 truncate">
                  {conv.title || "New Conversation"}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Theme
          </span>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg 
      text-slate-700 dark:text-slate-300
      hover:bg-slate-200 dark:hover:bg-slate-800 transition"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}
