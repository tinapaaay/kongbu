import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Browser tests in tests/e2e run with Playwright (`npm run test:e2e`), not Vitest.
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
  },
})
