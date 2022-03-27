import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {				// ← ← ← ← ← ←
    host: '0.0.0.0'	// ← new content ←
  },
  plugins: [vue()]
})
