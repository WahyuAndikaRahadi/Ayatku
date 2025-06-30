import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // <-- SANGAT PENTING! Ini harus '/' untuk deployment root di Vercel.
  build: {
    outDir: 'dist', // <-- Pastikan ini 'dist' agar sesuai dengan vercel.json Anda.
  },
  server: {
    // Konfigurasi proxy ini HANYA untuk pengembangan lokal, tidak berpengaruh di Vercel.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});