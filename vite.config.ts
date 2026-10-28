import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-advisories',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/advisories')) {
          try {
            const { default: handler } = await import('./api/advisories.ts');
            await handler(req, res);
          } catch (e) {
            console.error('Dev API error:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to load advisories' }));
          }
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devApiPlugin()],
  assetsInclude: ['**/*.md'],
});
