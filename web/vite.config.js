import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcss from './postcss.config.js';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss,
  },
  optimizeDeps: {
    include: ['mapbox-gl'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  build: {
    target: ['es2022'], // Set a more modern target that supports top-level await
  },
  server: {
    port: 3000,
  },
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
});
