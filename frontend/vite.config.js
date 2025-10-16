import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    // Esta sección es la que soluciona el problema
    hmr: {
      protocol: 'wss',
      host: 'localhost',
    },
    // Permite que ngrok se conecte
    allowedHosts: ['.ngrok-free.app'] 
  }
})
