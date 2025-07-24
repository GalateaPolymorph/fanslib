import globals from 'globals';
import baseConfig from './base.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.{js,ts,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Node.js specific rules can be added here
    },
  },
];