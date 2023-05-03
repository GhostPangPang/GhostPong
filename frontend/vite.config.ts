/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [react(), svgr()],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.wasm'],
      alias: {
        '@/**': path.resolve(__dirname, './src/**'),
        '@/styles': path.resolve(__dirname, './src/assets/styles'),
        '@/imgs': path.resolve(__dirname, './src/assets/imgs'),
        '@/svgs': path.resolve(__dirname, './src/assets/svgs'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/test': path.resolve(__dirname, './src/test'),
        '@/common': path.resolve(__dirname, './src/common'),
        '@/error': path.resolve(__dirname, './src/error'),
        '@/layout': path.resolve(__dirname, './src/layout'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/stores': path.resolve(__dirname, './src/stores'),
        '@/libs': path.resolve(__dirname, './src/libs'),
        '@/types': path.resolve(__dirname, './src/types'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      // you might want to disable it, if you don't have tests that rely on CSS
      // since parsing CSS is slow
      coverage: {
        provider: 'c8',
        include: ['src/**/*.{ts,tsx}'],
      },
    },
  });
};
