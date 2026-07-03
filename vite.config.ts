import type { IncomingMessage, ServerResponse } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import type { Plugin, ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// Twitch renders the panel in a cross-origin iframe, and browsers won't let you accept a
// self-signed cert *inside* an iframe — the frame silently blanks, so neither our bundle
// nor Twitch's helper loads. Use a locally-trusted mkcert cert when present (see README);
// fall back to basic-ssl's self-signed cert for viewing outside Twitch.
const certKey = fileURLToPath(new URL('./certs/localhost-key.pem', import.meta.url));
const certFile = fileURLToPath(new URL('./certs/localhost.pem', import.meta.url));
const hasTrustedCert = existsSync(certKey) && existsSync(certFile);

// Twitch loads the panel from a *public* origin (supervisor.ext-twitch.tv) into an iframe
// pointing at localhost. Chrome/Edge Private Network Access blocks public→private frames
// unless the private server answers the PNA preflight, so grant it for dev/Local Test.
// (Without this the frame stalls and you get "Extension Helper Library Not Loaded".)
const twitchLocalTestAccess: Plugin = {
  name: 'twitch-private-network-access',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Private-Network', 'true');
      res.setHeader('Vary', 'Origin');
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] ?? '*');
        res.statusCode = 204;
        res.end();
        return;
      }
      next();
    });
  },
};

/**
 * Vite config tuned for a Twitch panel extension:
 * - `base: './'` so the bundle works under Twitch's hashed CDN asset path.
 * - `modulePreload.polyfill: false` drops Vite's injected inline preload script so a
 *   strict `script-src 'self'` CSP holds (no external / inline JS beyond the helper).
 * - `basicSsl()` serves the dev server over HTTPS, which Twitch Local Test requires.
 */
export default defineConfig({
  base: './',
  plugins: [react(), twitchLocalTestAccess, ...(hasTrustedCert ? [] : [basicSsl()])],
  build: {
    target: 'es2022',
    modulePreload: { polyfill: false },
    // Twitch loads panel.html and config.html by path, so emit both as entries.
    rollupOptions: {
      input: {
        panel: fileURLToPath(new URL('./panel.html', import.meta.url)),
        config: fileURLToPath(new URL('./config.html', import.meta.url)),
      },
    },
  },
  server: {
    port: 8080,
    // CORS + PNA headers are owned by the twitchLocalTestAccess plugin; disable Vite's
    // built-in CORS so it doesn't emit a duplicate Access-Control-Allow-Origin.
    cors: false,
    ...(hasTrustedCert
      ? { https: { key: readFileSync(certKey), cert: readFileSync(certFile) } }
      : {}),
  },
  test: {
    environment: 'happy-dom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
