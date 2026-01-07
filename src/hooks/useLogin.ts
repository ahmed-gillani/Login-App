import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { loginUser } from "../api/authApi";

// Define login variables and response types
export interface LoginVariables {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id?: number;
    username: string;
    email?: string;
    role?: string;
    // match your actual user structure
  };
  tokens: {
    access: string;
    refresh?: string;
  };
}

export const useLogin = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginVariables
> => {
  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.tokens.access);
      if (data.tokens.refresh) {
        localStorage.setItem("refresh_token", data.tokens.refresh);
      }
      localStorage.setItem("user", JSON.stringify(data.user));
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
      // You can integrate toast notification here if you have one
    },
  });
};