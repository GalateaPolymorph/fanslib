import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsConfigPaths from 'vite-tsconfig-paths';
import { caddyPlugin } from './src/vite-plugin-caddy';

export default defineConfig({
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({ customViteReactPlugin: true }),
    viteReact(),
    caddyPlugin(),
    nodePolyfills(),
  ],
});
