import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

const PORT = 3030;

export default defineConfig({
  define: {
    'process.env': {},
  },
  build: {
    target: 'es2019', // 🚨 REQUIRED for iOS
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),

    legacy({
      targets: [
        'Safari >= 12',
        'iOS >= 12',
        'defaults',
      ],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
      ],
      modernPolyfills: true,
      renderLegacyChunks: true,
    }),

    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
});
