import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Keep production assets reachable when dist/index.html is opened directly.
  base: './',
  plugins: [react()],
});
