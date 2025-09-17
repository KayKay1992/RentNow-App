import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Local backend URL
        changeOrigin: true,
        secure: false, // Set to false for local HTTP
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
  },
});