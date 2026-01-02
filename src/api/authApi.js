  // // src/api/authApi.js
  // import axios from "./axios";

  // export async function loginUser(credentials) {
  //   const { data } = await axios.post("/login", credentials);
  //   return data;
  // }
// src/api/authApi.js
import api from "./axios";

export async function loginUser({ username, password }) {
  try {
    const res = await api.post("/api/users/login/", { username, password });
    // Backend response structure ke hisaab se adjust karo
    if (!res.data?.tokens?.access || !res.data?.user) {
      throw new Error("Invalid response from server");
    }
    return res.data;
  } catch (err) {
    if (err.response?.data?.detail) {
      throw new Error(err.response.data.detail);
    }
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Login failed. Please check credentials.");
  }
}