
import axios from "axios";

const FACILITY_ID = "t2y4sv_0954198_YRPC0QP";

const api = axios.create({
  baseURL: "https://dev.api.connecxguard.com",
  timeout: 15000,
  // REMOVED withCredentials: true → your backend doesn't use cookies!
  headers: {
    "Content-Type": "application/json",
    "X-Facility-Id": FACILITY_ID,
  },
});

// Send Facility ID on every request, and token only on protected endpoints
api.interceptors.request.use((config) => {
  // Always send Facility ID
  config.headers["X-Facility-Id"] = FACILITY_ID;

  // Do NOT send token on login endpoint
  if (config.url?.includes("/login")) {
    return config;
  }

  // For all other endpoints (like /api/policies/), add token if exists
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Added Bearer token to:", config.url); // Keep for debugging
  } else {
    console.warn("No access_token found – request may fail with 401:", config.url);
  }
  
  return config;
});


export default api;


// The real issue might be that the backend is using a different secret key to validate tokens than it used to create them. This is a server-side configuration problem.
