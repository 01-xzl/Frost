import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Frost — Cozy Focus Companion',
        short_name: 'Frost',
        description: 'A minimal task manager with glassmorphism UI, Pomodoro timer, and ambient sounds',
        theme_color: '#667eea',
        background_color: '#667eea',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [],
      },
    }),
  ],
})
