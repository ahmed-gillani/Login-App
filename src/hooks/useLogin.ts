// src/hooks/useLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, LoginVariables, LoginResponse } from '../api/authApi.ts';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: loginUser,

    onSuccess: (data) => {
      // Save to localStorage (your Axios interceptor will pick up the token)
      localStorage.setItem('access_token', data.tokens.access);
      if (data.tokens.refresh) {
        localStorage.setItem('refresh_token', data.tokens.refresh);
      }
      localStorage.setItem('user', JSON.stringify(data.user));

      // Invalidate any cached queries that require auth
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Or clear all if needed: queryClient.clear();
    },

    onError: (error) => {
      console.error('Login error:', error.message);
      // You can show toast here: toast.error(error.message)
    },
  });
};