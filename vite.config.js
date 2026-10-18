import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { optimizeImages } from './scripts/optimize-images.mjs';
import { attachAdminAuth } from './server/admin-auth.js';

export default defineConfig(async ({ mode }) => {
  await optimizeImages();
  const serverEnv = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  return { plugins: [react(), {
    name: 'wedding-admin-auth',
    configureServer(server) { attachAdminAuth(server, serverEnv); },
    configurePreviewServer(server) { attachAdminAuth(server, serverEnv); },
  }, {
    name: 'wedding-responsive-images',
    configureServer(server) {
      let timer;
      let queue = Promise.resolve();
      const onChange = filename => {
        const normalized = filename.replaceAll('\\', '/');
        if (!/\/public\/(photos|decor)\/.*\.(jpe?g|png|webp)$/i.test(normalized) && !normalized.endsWith('/src/config.js')) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          queue = queue.then(() => optimizeImages()).catch(error => server.config.logger.error(error.message));
        }, 250);
      };
      server.watcher.on('all', (_event, filename) => onChange(filename));
      server.httpServer?.once('close', () => clearTimeout(timer));
    },
  }] };
});
