import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async config => {
    // Configure PostCSS for Tailwind CSS 4 and DaisyUI
    config.css = config.css || {};

    // If postcss is a string (path to config), convert it to object
    if (typeof config.css.postcss === 'string' || !config.css.postcss) {
      config.css.postcss = {};
    }

    // Use Tailwind CSS 4 PostCSS plugin
    const tailwindcssPostcss = await import('@tailwindcss/postcss');

    config.css.postcss.plugins = [tailwindcssPostcss.default()];

    return config;
  },
};

export default config;
