// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff, Loader2 } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";
// import { useLogin } from "../hooks/useLogin";

// export default function Login() {
//   const [username, setUsername] = useState("admin"); // default username
//   const [password, setPassword] = useState("admin123"); // default password
//   const [showPassword, setShowPassword] = useState(false);
//   const [formError, setFormError] = useState("");

//   const navigate = useNavigate();
//   const { setUser } = useContext(AuthContext);
//   const { mutateAsync: login, isLoading } = useLogin();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");

//     try {
//       const data = await login({ username, password });
//       setUser(data.user); // update context
//       navigate("/dashboard"); // redirect after login
//     } catch (err) {
//       setFormError(err.message || "Login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4
//       bg-gradient-to-br from-gray-100 via-slate-200 to-blue-200"
//     >
//       <div className="w-full max-w-md bg-white/85 backdrop-blur-xl
//         rounded-3xl shadow-[0_20px_45px_rgba(0,0,0,0.2)] p-10 sm:p-12 animate-fadeIn"
//       >
//         <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
//           Portal Login
//         </h2>
//         <p className="text-center text-gray-500 mb-8">
//           Facility Management System
//         </p>

//         {formError && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-300
//             text-red-700 rounded-lg text-sm"
//           >
//             {formError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Username */}
//           <div className="relative">
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               placeholder=" "
//               className="peer w-full px-5 pt-6 pb-3 border border-gray-300 rounded-xl
//                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                 outline-none transition"
//             />
//             <label
//               className="absolute left-5 top-2 text-sm text-gray-500 transition-all
//                 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
//                 peer-focus:top-2 peer-focus:text-sm"
//             >
//               Username
//             </label>
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder=" "
//               className="peer w-full px-5 pt-6 pb-3 pr-12 border border-gray-300 rounded-xl
//                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                 outline-none transition"
//             />
//             <label
//               className="absolute left-5 top-2 text-sm text-gray-500 transition-all
//                 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
//                 peer-focus:top-2 peer-focus:text-sm"
//             >
//               Password
//             </label>

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 top-5 text-gray-500 hover:text-gray-800 transition"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full flex items-center justify-center gap-2
//               bg-gradient-to-r from-blue-600 to-indigo-600
//               text-white font-bold py-4 rounded-xl
//               transition disabled:opacity-70"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="animate-spin" size={18} />
//                 Logging in...
//               </>
//             ) : (
//               "Login as Portal Admin"
//             )}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-400 text-sm">
//           Need help? Contact IT Support.
//         </p>
//       </div>
//     </div>
//   );
// }
