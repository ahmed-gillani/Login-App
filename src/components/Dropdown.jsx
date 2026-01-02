
// src/components/Dropdown.jsx
import React, { useState, useRef, useEffect } from "react";

export default function Dropdown({ label = "Menu", items = [], icon }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button - Fixed gradient */}
      <button
        onClick={() => setOpen(!open)}
        className="
          px-6 py-3
          bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
          hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700
          text-white font-semibold
          rounded-xl shadow-lg
          transition-all duration-300 hover:shadow-xl hover:scale-105
          flex items-center justify-between min-w-48
        "
      >
        <span className="flex items-center gap-3">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <ul className="py-2">
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className="
                  flex items-center gap-4
                  px-5 py-3
                  text-gray-700 dark:text-gray-200
                  hover:bg-indigo-50 dark:hover:bg-indigo-900/30
                  cursor-pointer
                  transition-all duration-200
                "
              >
                {item.icon && (
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {item.icon}
                  </span>
                )}
                <span className="font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}