import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcss from './postcss.config.js';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss
  },
  optimizeDeps: {
    include: ['mapbox-gl']
  },
  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    port: 3000
  }
});