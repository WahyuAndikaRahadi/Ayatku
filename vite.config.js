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
            // Gunakan ikon yang sudah di-resize menjadi kotak sempurna 192x192
            src: 'icons/ayatku-192.png', 
            sizes: '192x192', 
            type: 'image/png',
            purpose: 'any'
          },
          {
            // Gunakan ikon yang sudah di-resize menjadi kotak sempurna 512x512
            src: 'icons/ayatku-512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' 
          }
        ],
        screenshots: [
          {
            src: "screenshots/desktop.png",
            sizes: "1875x911", // Sesuai log 'Actual Size' Anda
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "screenshots/mobile.png",
            sizes: "580x793", // Sesuai log 'Actual Size' Anda
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