import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // 1. Import plugin PWA

export default defineConfig({
  plugins: [
    react(),
    // 2. Tambahkan konfigurasi PWA
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'Ayatku | Al-Qur’an Digital & Jadwal Sholat',
        short_name: 'Ayatku',
        description: 'Al-Qur’an Digital, Doa Harian, Jadwal Sholat & Artikel Islami',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/ayatku.png', // Pastikan file ini ada di public/icons/ayatku.png
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/ayatku.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      // Strategi caching untuk data API (opsional tapi disarankan untuk aplikasi Islami)
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.quran\.gq\/.*$/i, // Contoh jika ambil data Quran dari API luar
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 hari
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: '/', 
  build: {
    outDir: 'dist', 
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});