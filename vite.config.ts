import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from /kongbu/; local dev, tests and previews use /.
  base: process.env.KONGBU_BASE ?? '/',
  plugins: [
    react(),
    // Makes Kongbu installable (Add to Home Screen) and able to open offline after the first visit.
    // A service worker saves every built file, including each chapter, the first time the app opens.
    VitePWA({
      // Ask before switching to a new version, so a deploy never reloads the page in the middle of a quiz.
      registerType: 'prompt',
      // src/app/ServiceWorkerUpdates.tsx registers it and shows the notice.
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kongbu · EPS-TOPIK Review',
        short_name: 'Kongbu',
        description: 'An unofficial EPS-TOPIK review app for the Standard Korean Language Textbook.',
        lang: 'en',
        display: 'standalone',
        // DESIGN.md Surface: the installed app's title bar and splash screen match the white navigation bar.
        theme_color: '#FEFEFE',
        background_color: '#FEFEFE',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Every page address (/learn/12, /mistakes…) opens the app shell, which then shows the right screen.
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Browser tests in tests/e2e run with Playwright (`npm run test:e2e`), not Vitest.
    exclude: [...configDefaults.exclude, 'tests/e2e/**', 'tests/sync/**'],
  },
})
