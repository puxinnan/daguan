import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-words',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/daguan/words')) {
            // If it's not requesting a static asset (like .js, .css, .png), serve the appropriate index.html
            if (!req.url.match(/\.[a-zA-Z0-9]+$/)) {
              // Remove trailing slash if exists to normalize
              let normalizedUrl = req.url.replace(/\/$/, '');
              req.url = normalizedUrl + '/index.html';
            }
          }
          next();
        });
      }
    }
  ],
  base: '/daguan/',
})
