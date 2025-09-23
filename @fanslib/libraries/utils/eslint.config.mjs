import bunConfig from '@fanslib/eslint/bun';
import tsParser from '@typescript-eslint/parser';

export default [
  ...bunConfig,
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
    ignores: [],
  },
];
