import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: 'build', // Use a shorter output directory
    chunkSizeWarningLimit: 1000, // Optional: Adjust chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Optional: Split vendor chunks
        },
      },
    },
  },
  resolve: {
    alias: {
      '@firebase/auth': 'node_modules/@firebase/auth', // Shorten the path for Firebase
    },
  },
});