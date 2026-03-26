import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Anchor/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      manifest: {
        name: 'Anchor',
        short_name: 'Anchor',
        start_url: '/Anchor/',
        scope: '/Anchor/',
        description: 'Din intelligente hverdagsassistent',
        theme_color: '#050505',
        background_color: '#050505',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://s1lence1q.github.io/Anchor/icon-192-v2.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://s1lence1q.github.io/Anchor/icon-512-v2.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://s1lence1q.github.io/Anchor/icon-512-v2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});
