# Unified Project Structure

**Monorepo Structure:** TurboRepo with Bun workspaces for optimal development and deployment

```
fanslib/                        # Project root
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml             # Continuous integration
│       ├── deploy.yaml         # Deployment pipeline
│       └── storybook.yaml      # Storybook deployment
├── docker/                     # Docker configurations
│   ├── Dockerfile.web          # Frontend container
│   ├── Dockerfile.server       # Backend container
│   ├── docker-compose.yml      # Development compose
│   └── docker-compose.prod.yml # Production compose
├── scripts/                    # Build and deployment scripts
│   ├── build.sh                # Build all packages
│   ├── deploy.sh               # Deployment script
│   ├── dev.sh                  # Development startup
│   └── test.sh                 # Test runner
├── docs/                       # Documentation
│   ├── prd.md                  # Product requirements
│   ├── front-end-spec.md       # Frontend specification
│   ├── architecture.md         # This document
│   └── deployment.md           # Deployment guide
├── @fanslib/                   # Monorepo packages directory
│   ├── apps/                   # Application packages
│   │   ├── web/                # React frontend application with integrated UI library and Storybook
│   │   │   ├── src/
│   │   │   │   ├── components/ # Feature-based components
│   │   │   │   ├── hooks/      # Custom React hooks
│   │   │   │   ├── stores/     # Jotai state atoms
│   │   │   │   ├── api/        # API functions
│   │   │   │   ├── utils/      # Frontend utilities
│   │   │   │   ├── ui/         # Design system components (integrated)
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ui/     # Design system components (integrated)
│   │   │   │   │   │   │   ├── hooks/     # UI-specific hooks
│   │   │   │   │   │   │   ├── types/     # UI component types
│   │   │   │   │   │   │   ├── utils/     # UI utilities
│   │   │   │   │   │   │   ├── styles.css # Component styles
│   │   │   │   │   │   │   └── index.ts   # UI exports
│   │   │   │   │   └── main.tsx    # Application entry point
│   │   │   ├── stories/        # Storybook stories (integrated)
│   │   │   ├── .storybook/     # Storybook configuration (integrated)
│   │   │   ├── public/         # Static assets
│   │   │   ├── index.html      # HTML template
│   │   │   ├── vite.config.ts  # Vite configuration
│   │   │   ├── tailwind.config.js # Tailwind CSS config
│   │   │   └── package.json
│   │   ├── server/             # Bun backend application
│   │   │   ├── src/
│   │   │   │   ├── routes/     # Elysia.js route handlers
│   │   │   │   ├── modules/    # Business logic functions
│   │   │   │   ├── background/ # Background processes
│   │   │   │   ├── database/   # Database access layer
│   │   │   │   ├── utils/      # Backend utilities
│   │   │   │   └── server.ts   # Server entry point
│   │   │   ├── prisma/         # Prisma schema and migrations
│   │   │   │   ├── schema.prisma # Database schema
│   │   │   │   └── migrations/ # Database migrations
│   │   │   └── package.json
│   ├── libraries/              # Domain-specific shared libraries
│   │       ├── src/
│   │       │   ├── types/      # TypeScript interfaces
│   │       │   │   ├── media.ts    # Media-related types
│   │       │   │   ├── posts.ts    # Post-related types
│   │       │   │   ├── channels.ts # Channel-related types
│   │       │   │   └── index.ts    # Type exports
│   │       │   ├── constants/  # Shared constants
│   │       │   ├── utils/      # Cross-platform utilities
│   │       │   └── index.ts    # Advanced entry point
│   │       └── package.json
│   └── configs/                # Shared configuration packages
│       ├── eslint/             # ESLint configurations
│       │   ├── base.js         # Base ESLint config
│       │   ├── react.js        # React-specific config
│       │   ├── node.js         # Node.js-specific config
│       │   └── package.json
│       ├── typescript/         # TypeScript configurations
│       │   ├── base.json       # Base TypeScript config
│       │   ├── react.json      # React-specific config
│       │   ├── node.json       # Node.js-specific config
│       │   └── package.json
│       └── prettier/           # Prettier configurations
│           ├── index.js        # Prettier config
│           └── package.json
├── scripts/                    # Build and deployment scripts
│   ├── build.sh                # Build all packages
│   ├── deploy.sh               # Deployment script
│   ├── dev.sh                  # Development startup
│   └── test.sh                 # Test runner
├── docs/                       # Documentation
│   ├── prd.md                  # Product requirements
│   ├── front-end-spec.md       # Frontend specification
│   ├── architecture.md         # This document
│   └── deployment.md           # Deployment guide
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── package.json                # Root package.json with workspaces
├── turbo.json                  # TurboRepo configuration
├── bun.lockb                   # Bun lockfile
└── README.md                   # Project documentation
```

## Workspace Configuration

**Root package.json with Bun workspaces:**

```json
{
  "name": "@fanslib/root",
  "private": true,
  "workspaces": [
    "@fanslib/apps/*",
    "@fanslib/libraries/*",
    "@fanslib/configs/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "storybook": "turbo run storybook",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "latest",
    "@fanslib/eslint": "workspace:*"
  }
}
```

**TurboRepo configuration (turbo.json):**

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "storybook-static/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {},
    "storybook": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Advanced Library Entry Points

**apps/web/src/components/ui with local entry points:**

```ts
// Expose UI via app-local barrel files rather than a separate package
// Example file: apps/web/src/components/ui/index.ts
export * from "./Button";
export * from "./Form";
export * from "./Media";
```

**Domain-specific library example (libraries/media-lib/package.json):**

```json
{
  "name": "@fanslib/media",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./utils": "./src/utils/index.ts",
    "./constants": "./src/constants/index.ts",
    "./api": "./src/api/index.ts",
    "./hooks": "./src/hooks/index.ts"
  },
  "dependencies": {},
  "devDependencies": {
    "@fanslib/eslint": "workspace:*",
    "@fanslib/typescript": "workspace:*",
    "typescript": "latest"
  }
}
```

## Library Build Strategy

**Critical Architectural Rule:** The UI lives inside `apps/web/src/components/ui` and is consumed via local imports. Libraries in `libraries/` remain domain-only and should **NOT** have their own build steps.

**Rationale:**

- **Faster Development:** No build step means instant changes during development
- **Better Tree Shaking:** Bundlers can optimize better with source TypeScript
- **Simplified Dependencies:** No need for separate build tooling in libraries
- **Type Safety:** Direct TypeScript consumption maintains full type information
- **Reduced Complexity:** Fewer build configurations to maintain

**Implementation:**

- UI is exported via app-local barrel files under `src/components/ui`
- Applications handle transpilation during their own build process
- TurboRepo pipeline excludes domain libraries from build dependencies
- Domain libraries focus on pure TypeScript/React code without bundling concerns

**Example library package.json (no build script):**

```ts
{
  "name": "@fanslib/ui",
  "exports": {
    ".": "./src/index.ts",
    "./components": "./src/components/index.ts"
  },
  "scripts": {
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
    // Note: No "build" script
  }
}
```

**Configuration package example (configs/eslint/package.json):**

```json
{
  "name": "@fanslib/eslint",
  "version": "0.0.0",
  "main": "base.js",
  "exports": {
    ".": "./base.js",
    "./base": "./base.js",
    "./react": "./react.js",
    "./node": "./node.js"
  },
  "dependencies": {
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
```
