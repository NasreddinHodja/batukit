import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'dev',
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
