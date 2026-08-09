import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createRequire } from 'node:module';

const { version } = createRequire(import.meta.url)('./package.json');

export default defineConfig({
  plugins: [react()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version ?? version),
  },
});
