import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url';

// Replicate __dirname functionality in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './')
    }
  },
  server: {
    port: 3000,
    fs: {
      strict: false // Allow serving files from directories not directly under root
    }
  },
  build: {
    outDir: 'dist'
  },
  // This is important if your index.html directly imports from node_modules like esm.sh
  // For the current setup with importmap, this might not be strictly needed for dev,
  // but good for ensuring Vite understands the module structure.
  optimizeDeps: {
    // entries: ['./index.html'], // Ensure Vite processes scripts in index.html
    // include: ['react', 'react-dom', 'react-router-dom', '@google/genai'] // Pre-bundle these
  }
})