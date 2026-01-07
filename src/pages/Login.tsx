// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { useLogin } from "../hooks/useLogin.ts";

interface User {
  id?: number;
  username: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export default function Login() {
  const [username, setUsername] = useState<string>("admin");
  const [password, setPassword] = useState<string>("admin123");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { mutate: login, isPending, error, isError } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(
      { username, password },
      {
        onSuccess: (data) => {
          setUser(data.user);
          navigate("/dashboard");
        },
      }
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-100 via-slate-200 to-blue-200">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 sm:p-12">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
          Portal Login
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Facility Management System
        </p>

        {isError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error?.message || "Login failed. Please check your credentials."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isPending}
              placeholder=" "
              className="peer w-full px-5 pt-6 pb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50"
            />
            <label className="absolute left-5 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm pointer-events-none">
              Username
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isPending}
              placeholder=" "
              className="peer w-full px-5 pt-6 pb-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50"
            />
            <label className="absolute left-5 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm pointer-events-none">
              Password
            </label>

            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={isPending}
              className="absolute right-4 top-5 text-gray-500 hover:text-gray-800 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Logging in...
              </>
            ) : (
              "Login as Portal Admin"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Need help? Contact IT Support.
        </p>
      </div>
    </div>
  );
}