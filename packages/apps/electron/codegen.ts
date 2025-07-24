import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/graphql/postpone/schema.graphql",
  documents: ["./src/features/api-postpone/**/*.ts"],
  generates: {
    "./src/graphql/postpone/types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        avoidOptionals: true,
        enumsAsTypes: true,
        skipTypename: true,
        dedupeFragments: true,
      },
    },
  },
};

export default config;
