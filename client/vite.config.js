import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 1. Remove 'tailwind()' from here. Tailwind runs via PostCSS.
  plugins: [react()], 
  
  server: {
    proxy: {
      // 2. This creates a tunnel from your frontend to your backend
      "/api": {
        target: "http://localhost:8000", // Your backend URL
        changeOrigin: true,
        secure: false,      
        
        // 3. This rewrite is important!
        // It means if you call axios.get('/api/login') in React,
        // Vite sends the request to: http://localhost:8000/api/v1/login
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      }
    }
  }
})