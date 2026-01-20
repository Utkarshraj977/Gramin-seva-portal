import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      proxy: {
        '/api': {
          target: `${env.VITE_BASE_URL}`, // https://gramin-seva-portal.onrender.com
          changeOrigin: true,
          secure: true,
        }
      }
    },
    plugins: [react()],
  }
})