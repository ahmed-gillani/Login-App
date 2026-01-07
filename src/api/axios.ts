// src/api/axios.ts
import axios from "axios";

const FACILITY_ID = "t2y4sv_0954198_YRPC0QP";

const api = axios.create({
  baseURL: "https://dev.api.connecxguard.com",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Facility-Id": FACILITY_ID,
  },
});

// Auto-add Bearer token + Facility ID on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["X-Facility-Id"] = FACILITY_ID;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;