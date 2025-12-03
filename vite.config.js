import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy all /api requests to your backend
      "/api": {
        target: "https://3-149-121-205.nip.io",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})