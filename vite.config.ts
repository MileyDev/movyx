import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'movyx.png'],
    manifest: {
      name: 'Movyx - HD movies',
      short_name: 'Movyx',
      description: 'Explore latest trending movies and shows in HD streaming for FREE!',
      theme_color: 'rgba(255, 1, 1, 0.98)',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'movyx.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'movyx.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      globPatterns:  ['/*.{js,css,html,ico,png,svg}'],
    }
  })],
})
