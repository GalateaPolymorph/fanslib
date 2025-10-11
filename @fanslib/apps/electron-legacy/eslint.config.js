import { react } from "@fanslib/eslint-config";

export default [
  ...react,
  {
    ignores: [
      "node_modules/",
      "dist/",
      "out/",
      "build/",
      ".storybook/",
      "storybook-static/",
      "*.stories.tsx",
    ],
  },
];
