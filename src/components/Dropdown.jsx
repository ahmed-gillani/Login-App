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
      {/* Dropdown button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-56 h-11
          flex items-center justify-between
          px-4
          rounded-lg
          bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
          text-white font-semibold
          shadow
          hover:scale-105
          transition-transform
        "
      >
        <span className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
        </span>

        {/* Arrow */}
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="
            absolute right-0 mt-2
            w-56
            bg-white
            rounded-lg
            shadow-lg
            z-50
            ring-1 ring-black ring-opacity-5
          "
        >
          <ul className="py-1">
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  item.onClick && item.onClick();
                  setOpen(false);
                }}
                className="
                  flex items-center gap-3
                  px-4 py-2
                  text-gray-800
                  hover:bg-indigo-100
                  cursor-pointer
                  transition
                "
              >
                {item.icon && (
                  <span className="text-indigo-500">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
