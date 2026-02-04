import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600, // Increase warning limit to 600 kB
    rollupOptions: {
      output: {
        manualChunks: {
          'pdfjs': ['pdfjs-dist'],
          'markdown': ['react-markdown'],
          'icons': ['react-icons', 'lucide-react'],
          'router': ['react-router-dom'],
          'vendor': ['react', 'react-dom'],
        }
      }
    }
  }
})
