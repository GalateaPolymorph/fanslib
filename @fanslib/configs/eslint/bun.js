import baseConfig from "./base.mjs";

export default [
  ...baseConfig,
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      globals: {
        Bun: "readonly",
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      // Bun specific rules
      "no-console": "off", // Console logging is acceptable in backend
      "@typescript-eslint/no-var-requires": "off", // Bun supports require
    },
  },
];
