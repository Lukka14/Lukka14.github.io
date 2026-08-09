import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createRequire } from 'node:module';

const { version } = createRequire(import.meta.url)('./package.json');

export default defineConfig({
  plugins: [react()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version ?? version),
  },
  build: {
    rollupOptions: {
      output: {
        // Vendor code changes far less often than app code, so giving it its
        // own chunks lets returning visitors reuse the cached copy after a
        // deploy instead of re-downloading everything.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
});
