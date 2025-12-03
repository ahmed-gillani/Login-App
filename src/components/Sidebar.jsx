import { useState } from "react";
import {
  Menu,
  X,
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

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden p-2 fixed top-3 left-3 z-50 bg-white rounded shadow"
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

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full
          bg-white border-r shadow-sm z-50
          flex flex-col transition-all duration-300
          w-60                               /* ← REAL CHATGPT WIDTH */
          ${openMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold">
              AI
            </div>
            <span className="font-medium text-gray-700 text-lg">ChatGPT</span>
          </div>

          {openMobile && (
            <button
              onClick={() => setOpenMobile(false)}
              className="md:hidden p-2 rounded hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* New Chat */}
        <nav className="p-3 space-y-2">
          <button
            onClick={() => {
              onSelectOption(null);
              onNewChat();
              setOpenMobile(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-100 transition"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </nav>

        {/* MENU OPTIONS */}
        <div className="p-3 space-y-1">
          <SidebarItem
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
        <div className="flex-1 overflow-auto px-3 space-y-2 mt-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                onSelect(conv.id);
                setOpenMobile(false);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition
                ${
                  conv.id === activeId
                    ? "bg-sky-50 border border-sky-200"
                    : "hover:bg-slate-100"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={16} className="text-slate-600" />
                <span className="text-sm truncate">
                  {conv.title || "New Conversation"}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="text-xs text-red-500 p-1 rounded hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t text-[11px] text-slate-500 text-center">
          Made with ❤️
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-100 transition"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}
