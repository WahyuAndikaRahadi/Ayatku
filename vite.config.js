import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Konfigurasi proxy untuk meneruskan permintaan API ke backend Node.js Anda
    proxy: {
      '/api': { // Setiap permintaan yang dimulai dengan '/api'
        target: 'http://localhost:5000', // Akan diteruskan ke backend yang berjalan di port 5000
        changeOrigin: true, // Diperlukan untuk host virtual
        rewrite: (path) => path.replace(/^\/api/, ''), // Menghapus '/api' dari path permintaan ke backend
      },
    },
  },
});
