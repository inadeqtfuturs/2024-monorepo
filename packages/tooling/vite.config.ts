import dotenv from 'dotenv';
import path from 'node:path';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
  const root = path.resolve(__dirname, '../..');
  dotenv.config({ path: `${__dirname}/../../.env` });

  const tsPaths = tsConfigPaths({
    root,
    projects: [
      path.resolve(__dirname, '../ui/tsconfig.json'),
      path.resolve(__dirname, '../poptoast/tsconfig.json'),
      path.resolve(__dirname, '../mdx-relations/tsconfig.json'),
      path.resolve(__dirname, '../../apps/web/tsconfig.json'),
    ],
  });

  return {
    test: {
      globals: true,
      root,
      coverage: {
        provider: 'v8',
        clean: true,
        reporter: ['text', 'html', 'clover', 'json', 'cobertura'],
      },
      environment: 'jsdom',
    },
    plugins: [tsPaths],
  };
});
