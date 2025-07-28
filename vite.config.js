// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/streaming-frontend/', // 👈 muy importante para GitHub Pages
  plugins: [react()],
});
