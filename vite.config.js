import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ['admin-m1b6.onrender.com'],
  },
  preview: {
    port: 4173,
    allowedHosts: ['localhost', 'admin-m1b6.onrender.com'],
  },
})
