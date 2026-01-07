// src/api/authApi.ts
import api from './axios.ts';

export interface LoginVariables {
  username: string;
  password: string;
}

export interface User {
  id?: number;
  username: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export interface Tokens {
  access: string;
  refresh?: string;
}

export interface LoginResponse {
  user: User;
  tokens: Tokens;
  message?: string;
  detail?: string;
}

export const loginUser = async (credentials: LoginVariables): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/users/login/', credentials);
    const data = response.data;

    if (!data.tokens?.access) {
      throw new Error('No access token received from server');
    }
    if (!data.user) {
      throw new Error('No user data received from server');
    }

    return data;
  } catch (error: any) {
    if (error.response?.data) {
      const serverError = error.response.data;
      if (serverError.detail) throw new Error(serverError.detail);
      if (serverError.message) throw new Error(serverError.message);
      if (typeof serverError === 'object') {
        const messages = Object.values(serverError).flat().join(' ');
        throw new Error(messages || 'Validation error');
      }
    }
    if (error.message === 'Network Error') {
      throw new Error('Network error. Please check your connection.');
    }
    throw new Error(error.message || 'Login failed. Please try again.');
  }
};