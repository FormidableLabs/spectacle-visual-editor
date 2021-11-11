import { defineConfig, UserConfigExport } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import builtins from 'rollup-plugin-node-builtins';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config: UserConfigExport = {
    plugins: [
      react({
        babel: {
          plugins: ['babel-plugin-styled-components']
        },
        exclude: 'src/stories'
      }),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
    ],
    define: {
      'process.env': process.env
    },
    server: {
      port: 8080,
      open: true
    },
    root: 'src'
  };

  if (command === 'build') {
    config.build = {
      outDir: path.resolve(__dirname, 'build'),
      rollupOptions: {
        plugins: [builtins]
      },
      emptyOutDir: true
    };
  }

  return config;
});
