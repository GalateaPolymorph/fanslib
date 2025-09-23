import reactConfig from '@fanslib/eslint/react';
import tsParser from '@typescript-eslint/parser';

export default [
  ...reactConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    ignores: [
      'dist',
      'node_modules',
      'vite.config.ts',
      'src/vite-plugin-caddy.ts',
    ],
  },
];
