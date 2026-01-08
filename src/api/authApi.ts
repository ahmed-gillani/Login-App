// src/api/authApi.ts
import api from "./axios.ts";

export interface LoginVariables {
  username: string;
  password: string;
}

export interface User {
  username: string;
  role?: string;
}

export const loginUser = async (credentials: LoginVariables) => {
  try {
    const response = await api.post("/api/users/login/", credentials);
    const data = response.data;

    // Token sirf tab save karo agar backend deta hai (tokens.access)
    const token = data?.tokens?.access;
    if (token) {
      localStorage.setItem("access_token", token);
    }

    // User save karo (backend se aaye ya username se bana lo)
    const user = data?.user || { username: credentials.username };
    localStorage.setItem("user", JSON.stringify(user));

    return { user };
  } catch (error: any) {
    const msg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Invalid username or password";

    throw new Error(msg);
  }
};