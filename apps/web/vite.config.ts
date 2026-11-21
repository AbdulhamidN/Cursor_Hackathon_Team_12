import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

// The single .env file lives in the repository root. Vite only exposes
// variables prefixed with VITE_ to browser code.
const envDir = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, '');

  // Requests to /api are forwarded to the API, so the browser never needs CORS in development.
  const proxy = {
    '/api': { target: `http://localhost:${env.API_PORT || 4000}`, changeOrigin: true },
  };

  return {
    envDir,
    plugins: [react(), tailwindcss()],
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 4173, strictPort: true, proxy },
  };
});
