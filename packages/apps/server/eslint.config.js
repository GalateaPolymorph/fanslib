import { node } from "@fanslib/eslint-config";

export default [
  ...node,
  {
    rules: {
      "functional/no-classes": "off",
    },
  },
];
