import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { optimizeImages } from './scripts/optimize-images.mjs';

export default defineConfig(async () => {
  await optimizeImages();
  return { plugins: [react(), {
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
