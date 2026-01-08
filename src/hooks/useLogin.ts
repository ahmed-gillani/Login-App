// src/hooks/useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, LoginVariables, LoginResponse } from "../api/authApi.ts"; // ← Import types from authApi

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);
    },
    onError: () => {
      localStorage.removeItem("user");
      queryClient.setQueryData(["user"], null);
    },
  });
};