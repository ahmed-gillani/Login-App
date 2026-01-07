// import React, { createContext, useState, useEffect } from "react";
// import api from "../api/axios";

// export const AuthContext = createContext();

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//     window.location.href = "/login";
//   };

//   const refreshToken = async () => {
//     try {
//       const refresh = localStorage.getItem("refresh_token");
//       if (!refresh) return logout();

//       const res = await api.post("/api/users/refresh/", { refresh });
//       if (res?.data?.access) {
//         localStorage.setItem("access_token", res.data.access);
//         return res.data.access;
//       }
//       return null;
//     } catch (err) {
//       logout();
//       return null;
//     }
//   };

//   useEffect(() => {
//     const interceptor = api.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const original = error.config;
//         if (!original || original._retry) return Promise.reject(error);

//         if (error.response?.status === 401) {
//           original._retry = true;
//           const newAccess = await refreshToken();
//           if (newAccess) {
//             original.headers = original.headers || {};
//             original.headers.Authorization = `Bearer ${newAccess}`;
//             return api(original);
//           }
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => api.interceptors.response.eject(interceptor);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
