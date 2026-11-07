import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 10510,
    strictPort: true,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 2048,
    sourcemap: true,
  },
});
