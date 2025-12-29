import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
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
            // Menggunakan ukuran asli 421x434 agar tidak error "match specified size"
            src: 'icons/ayatku.png', 
            sizes: '421x434', 
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/ayatku.png', 
            sizes: '421x434',
            type: 'image/png',
            purpose: 'maskable' 
          }
        ],
        screenshots: [
          {
            // Disesuaikan dengan Actual Size: 1875x911 px di log Anda
            src: "screenshots/desktop.png",
            sizes: "1875x911", 
            type: "image/png",
            form_factor: "wide"
          },
          {
            // Disesuaikan dengan Actual Size: 580x793 px di log Anda
            src: "screenshots/mobile.png",
            sizes: "580x793", 
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.quran\.gq\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
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