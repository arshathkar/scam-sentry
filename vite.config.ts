import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/scam-sentry/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: false, // We provide our own manifest.json in public/
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50 MB for WASM files
        runtimeCaching: [
          {
            // Cache Tesseract trained-data files
            urlPattern: /\.traineddata(\.gz)?$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tesseract-data',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true, // Expose to local network for mobile testing
  },
});
