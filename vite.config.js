// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   optimizeDeps: {
//     include: ['react-typed'],  // ← Yeh line add karo! Yeh Vite ko force karega react-typed ko sahi se load karne ke liye
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target: "https://dev.api.connecxguard.com",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })