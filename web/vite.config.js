import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from './postcss.config.js'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.js', '.jsx', '.json']
  }
})