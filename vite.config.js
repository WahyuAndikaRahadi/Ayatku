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
            // Pastikan file ini sudah di-resize menjadi tepat 192x192 piksel
            src: 'icons/icon-192.png', 
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            // Pastikan file ini sudah di-resize menjadi tepat 512x512 piksel
            src: 'icons/icon-512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' // Rekomendasi untuk Android
          }
        ],
        // Menambahkan screenshot untuk memperbaiki error "Richer PWA Install UI"
        screenshots: [
          {
            src: "screenshots/desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "screenshots/mobile.png",
            sizes: "720x1280",
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