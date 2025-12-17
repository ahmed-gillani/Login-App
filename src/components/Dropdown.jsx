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
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none gap-2"
      >
        {icon && <span className="text-gray-500">{icon}</span>}
        {label}
        <svg
          className="ml-2 -mr-1 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 origin-top-right transition-transform transform scale-95 opacity-0 animate-dropdown">
          <ul className="py-1">
            {items.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  item.onClick && item.onClick();
                  setOpen(false);
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>
        {`
          @keyframes dropdown {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-dropdown {
            animation: dropdown 0.15s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
