// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    hmr: true,               // keep it
    watch: {
      usePolling: true,      // ← poll for changes instead of waiting for inotify
      interval: 100          // ← check every 100ms (tweak as you like)
    },
    proxy: {
      '/staff-api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
