// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const logout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    } catch (e) {}

    setUser(null);
    window.location.href = "/login";
  };

  // NEW COOKIE-BASED REFRESH
  const refreshToken = async () => {
    try {
      console.log("[refreshToken] Calling /api/users/refresh/");

      // ⬇⬇⬇ EMPTY BODY – refresh token comes from HttpOnly cookie
      // Ensure we send cookies (HttpOnly refresh cookie)
      const res = await api.post("/api/users/refresh/", {}, { withCredentials: true });

      console.log("[refreshToken] response:", res.data);

      if (res?.data?.access) {
        localStorage.setItem("access_token", res.data.access);
        return res.data.access;
      }

      return null;
    } catch (err) {
      console.error(
        "[refreshToken] failed:",
        err?.response?.data || err?.message
      );
      logout();
      return null;
    }
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) return Promise.reject(error);
        if (originalRequest._retry) return Promise.reject(error);

        if (error.response?.status === 401) {
          console.warn("401 detected → trying refresh");

          originalRequest._retry = true;
          const newAccess = await refreshToken();

          if (newAccess) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
            return api(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
