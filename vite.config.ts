import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from /kongbu/; local dev, tests and previews use /.
  base: process.env.KONGBU_BASE ?? '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Browser tests in tests/e2e run with Playwright (`npm run test:e2e`), not Vitest.
    exclude: [...configDefaults.exclude, 'tests/e2e/**', 'tests/sync/**'],
  },
})
