
// // src/components/Header.jsx
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ChevronLeft, Share2, UserPlus, MoreVertical, Edit3, RotateCcw, Trash2 } from "lucide-react";

// export default function Header({ title = "Chatbot" }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [openMenu, setOpenMenu] = useState(false);

//   const showBack = location.pathname.includes("/chatbot");

//   return (
//     <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
//       <div className="flex items-center justify-between px-6 h-16">

//         {/* Left: Back Button + Title */}
//         <div className="flex items-center gap-4">
//           {showBack && (
//             <button
//               onClick={() => navigate("/dashboard")}
//               className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//               aria-label="Back to dashboard"
//             >
//               <ChevronLeft size={22} className="text-gray-600 dark:text-gray-400" />
//             </button>
//           )}
//           <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
//             {title}
//           </h1>
//         </div>

//         {/* Right: Action Buttons */}
//         <div className="flex items-center gap-2 relative">
//           <button
//             className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//             title="Share chat"
//             aria-label="Share"
//           >
//             <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
//           </button>

//           <button
//             className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//             title="Add people"
//             aria-label="Add people"
//           >
//             <UserPlus size={20} className="text-gray-600 dark:text-gray-400" />
//           </button>

//           {/* More Options Menu */}
//           <div className="relative">
//             <button
//               onClick={() => setOpenMenu(!openMenu)}
//               className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//               title="More options"
//               aria-label="More options"
//             >
//               <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
//             </button>

//             {openMenu && (
//               <>
//                 {/* Overlay to close menu when clicking outside */}
//                 <div
//                   className="fixed inset-0 z-40"
//                   onClick={() => setOpenMenu(false)}
//                 />

//                 {/* Dropdown Menu */}
//                 <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
//                   <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
//                     <Edit3 size={16} />
//                     Rename chat
//                   </button>
//                   <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
//                     <RotateCcw size={16} />
//                     Clear messages
//                   </button>
//                   <hr className="border-gray-200 dark:border-gray-700" />
//                   <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition">
//                     <Trash2 size={16} />
//                     Delete chat
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }