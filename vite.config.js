import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api/printify': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/api/orders': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})