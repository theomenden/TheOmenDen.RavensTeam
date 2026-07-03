import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

/**
 * Vite config tuned for a Twitch panel extension:
 * - `base: './'` so the bundle works under Twitch's hashed CDN asset path.
 * - `modulePreload.polyfill: false` drops Vite's injected inline preload script so a
 *   strict `script-src 'self'` CSP holds (no external / inline JS beyond the helper).
 * - `basicSsl()` serves the dev server over HTTPS, which Twitch Local Test requires.
 */
export default defineConfig({
  base: './',
  plugins: [react(), basicSsl()],
  build: {
    target: 'es2022',
    modulePreload: { polyfill: false },
  },
  server: {
    port: 8080,
  },
  test: {
    environment: 'happy-dom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
