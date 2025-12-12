// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        logout();
        return null;
      }

      console.log("[refreshToken] Sending refresh:", refresh);

      const res = await api.post("/api/users/refresh/", {
        refresh: refresh,      // ✅ your backend requires this
      });

      console.log("[refreshToken] Response:", res.data);

      if (res?.data?.access) {
        localStorage.setItem("access_token", res.data.access);
        return res.data.access;
      }

      return null;
    } catch (err) {
      console.error("[refreshToken ERROR]:", err?.response?.data || err);
      logout();
      return null;
    }
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;

        if (!original || original._retry) return Promise.reject(error);

        if (error.response?.status === 401) {
          console.log("401 detected — refreshing access token...");
          original._retry = true;

          const newAccess = await refreshToken();
          if (newAccess) {
            original.headers = original.headers || {};
            original.headers["Authorization"] = `Bearer ${newAccess}`;
            return api(original);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
