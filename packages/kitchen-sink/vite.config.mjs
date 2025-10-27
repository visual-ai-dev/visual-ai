import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve:
    process.env.NODE_ENV === 'production'
      ? {}
      : {
          alias: {
            ['react-grab']: path.resolve(__dirname, '../react-grab/dist/index.global.js'),
          },
        },
});
