import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/getCongestion': 'http://localhost:8080',
      '/getCongestionHistory': 'http://localhost:8080',
      '/health': 'http://localhost:8080',
      '/signage': 'http://localhost:8080',
      '/receiveSensorData': 'http://localhost:8080',
    },
  },
})
