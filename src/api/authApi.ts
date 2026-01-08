// src/api/authApi.ts
import api from "./axios.ts";

export interface LoginVariables {
  username: string;
  password: string;
}

export interface User {
  username: string;
  role?: string;
  // add more fields later when backend returns them
}

export interface LoginResponse {
  user: User;
}

export const loginUser = async (credentials: LoginVariables): Promise<LoginResponse> => {
  try {
    const response = await api.post("/api/users/login/", credentials);

    console.log("Login Response:", response.data); // DEBUG: See what backend returns

    // Store the access token if returned by the backend
    // Try different possible token field names
    const token = response.data?.access || response.data?.access_token || response.data?.token;
    
    if (token) {
      localStorage.setItem("access_token", token);
      console.log("Token stored:", token); // DEBUG: Confirm token is stored
    } else {
      console.warn("No token found in login response:", response.data); // DEBUG: Warn if no token
    }

    return {
      user: {
        username: credentials.username,
      },
    };
  } catch (error: any) {
    let errorMessage = "Invalid username or password";

    if (error.response?.data) {
      const data = error.response.data;
      if (data.detail) errorMessage = data.detail;
      else if (data.message) errorMessage = data.message;
      else if (typeof data === "object") {
        errorMessage = Object.values(data).flat().join(" ") || errorMessage;
      }
    }

    throw new Error(errorMessage);
  }
};