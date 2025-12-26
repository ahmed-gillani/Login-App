import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";

export const loginUser = async ({ username, password }) => {
  try {
    const res = await api.post("/api/users/login/", { username, password });
    if (!res.data?.tokens?.access || !res.data?.user) {
      throw new Error("Invalid login response from server.");
    }
    return res.data;
  } catch (err) {
    if (!err.response) {
      throw new Error("No response from server. Please check your network.");
    }
    if (err.response.data?.detail) {
      throw new Error(err.response.data.detail);
    }
    if (err.response.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Server error. Please try again later.");
  }
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.tokens.access);
      localStorage.setItem("refresh_token", data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });
};
