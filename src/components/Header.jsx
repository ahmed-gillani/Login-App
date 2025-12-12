import React, { useEffect, useState } from "react";
import { ChevronLeft, Share2, Users, MoreHorizontal, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({
  title = "Assistant",
  subtitle = "How can I help you today?",
  showBack = true,
}) {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-40">
      {/* Topbar (left controls + right icons) */}
      <div className="flex items-center justify-between px-6 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Back"
            >
              <ChevronLeft size={18} />
            </button>
          )}

        </div>

        {/* Center title area (desktop only) */}
        <div className="hidden lg:flex flex-col items-center">
          <h1 className="text-xl font-extrabold text-blue-500 dark:text-blue-400 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <button
              title="Share"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Share2 size={16} />
            </button>
            <button
              title="Add People"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Users size={16} />
            </button>
            <button
              title="More"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Theme toggle (keeps in sync with Sidebar toggle) */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Optional small hero area for mobile / small screens (placed under topbar) */}
      <div className="lg:hidden px-6 py-4 bg-transparent border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
