// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

/* ------------------ Types ------------------ */

export interface Conversation {
  id: string;
  title?: string;
}

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

type Theme = "light" | "dark";

/* ------------------ Component ------------------ */

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
}) => {
  const [openMobile, setOpenMobile] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "light"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  /* ------------------ Effects ------------------ */

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ------------------ Derived State ------------------ */

  const filteredConversations = conversations.filter((conv) =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ------------------ Handlers ------------------ */

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* ------------------ JSX ------------------ */

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition"
        onClick={() => setOpenMobile(true)}
      >
        <Menu size={22} className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* Mobile Overlay */}
      {openMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl z-50 flex flex-col transition-transform duration-300 ${
          openMobile
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                AI
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Assistant
              </h1>
            </div>

            <button
              onClick={() => setOpenMobile(false)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              setOpenMobile(false);
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {filteredConversations.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">
              {searchQuery ? "No chats found" : "Start a new conversation"}
            </p>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  onSelect(conv.id);
                  setOpenMobile(false);
                }}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition ${
                  conv.id === activeId
                    ? "bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare
                    size={18}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                    {conv.title || "New Chat"}
                  </span>
                </div>

                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </span>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
              {theme === "dark" ? (
                <Moon size={20} className="text-indigo-500" />
              ) : (
                <Sun size={20} className="text-yellow-500" />
              )}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
