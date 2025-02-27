import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
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
    outDir: 'dist', // Specify the output directory
    chunkSizeWarningLimit: 1000, // Optional: Adjust chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Optional: Split vendor chunks
        },
      },
    },
  },
});