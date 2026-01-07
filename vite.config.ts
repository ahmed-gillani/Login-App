import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react-typed'],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dev.api.connecxguard.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
