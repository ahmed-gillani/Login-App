import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "../api/axios.ts";

// Define the User type (adjust fields based on your actual API response)
export interface User {
  id?: number;
  username: string;
  email?: string;
  role?: string;
  // add any other fields your user object has
}

// Define the Auth Context shape
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Create context with proper type (undefined initially)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context safely
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) return logout(), null;

      const res = await api.post("/api/users/refresh/", { refresh });
      if (res?.data?.access) {
        localStorage.setItem("access_token", res.data.access);
        return res.data.access;
      }
      return null;
    } catch (err) {
      logout();
      return null;
    }
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        const original = error.config;
        if (!original || original._retry) return Promise.reject(error);

        if (error.response?.status === 401) {
          original._retry = true;
          const newAccess = await refreshToken();
          if (newAccess) {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newAccess}`;
            return api(original);
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