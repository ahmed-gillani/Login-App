// // src/hooks/useLogin.js
// import { useMutation } from "@tanstack/react-query";
// import { loginUser } from "../api/authApi";

// export const useLogin = () => {
//   return useMutation({
//     mutationFn: loginUser,
//     onSuccess: (data) => {
//       localStorage.setItem("access_token", data.tokens.access);
//       localStorage.setItem("user", JSON.stringify(data.user));
//     },
//     onError: (error) => {
//       console.error("Login failed:", error.message);
//       // Optional: show toast
//     },
//   });
// };