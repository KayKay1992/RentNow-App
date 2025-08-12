import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
  proxy: {
    '/api': {
      target: 'https://rent-now-app-r2qe.vercel.app',
      changeOrigin: true,
      secure: true,
    },
  },
},
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
  },
});