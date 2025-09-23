# Unified Project Structure

**Monorepo Structure:** TurboRepo with Bun workspaces for optimal development and deployment

```
fanslib-web/                    # Project root
├── .github/                    # CI/CD workflows (if present)
│   └── workflows/
├── docs/                       # Documentation
│   └── architecture/           # Architecture documentation
├── @fanslib/                   # Monorepo packages directory
│   ├── apps/                   # Application packages
│   │   ├── web/                # TanStack Start React frontend application
│   │   │   ├── src/
│   │   │   │   ├── components/ # Feature-based components
│   │   │   │   │   ├── ui/         # Design system components (integrated)
│   │   │   │   ├── db/         # Database schema and connection
│   │   │   │   │   ├── schema.ts   # Drizzle schema definition
│   │   │   │   │   └── connection.ts
│   │   │   │   ├── lib/        # Frontend utilities
│   │   │   │   │   ├── trpc/       # tRPC client and server setup
│   │   │   │   │   │   ├── client.ts
│   │   │   │   │   │   ├── server.ts
│   │   │   │   │   │   └── routes/
│   │   │   │   │   │       ├── index.ts
│   │   │   │   │   │       ├── media.ts
│   │   │   │   │   │       └── shoots.ts
│   │   │   │   │   ├── collections.ts  # TanStack DB collections
│   │   │   │   │   ├── electric-proxy.ts
│   │   │   │   │   └── seo.ts
│   │   │   │   ├── routes/     # TanStack Start routes
│   │   │   │   │   ├── api/        # API routes
│   │   │   │   │   │   ├── trpc/  # tRPC endpoint
│   │   │   │   │   │   ├── (api routes)
│   │   │   │   │   └── (app pages)
│   │   │   │   ├── state/      # Jotai state atoms
│   │   │   │   ├── router.tsx  # TanStack Router configuration
│   │   │   │   ├── routeTree.gen.ts # Generated route tree
│   │   │   │   ├── styles.css  # Global styles
│   │   │   │   └── vite-plugin-caddy.ts
│   │   │   ├── .storybook/     # Storybook configuration
│   │   │   ├── .tanstack/      # TanStack build artifacts
│   │   │   ├── public/         # Static assets
│   │   │   ├── tests/          # Test files
│   │   │   ├── Caddyfile       # Caddy server configuration
│   │   │   ├── drizzle.config.ts # Drizzle configuration
│   │   │   ├── vite.config.ts  # Vite configuration
│   │   │   ├── vitest.config.ts # Vitest configuration
│   │   │   └── package.json
│   │   ├── server/             # Background Job server
│   │   │   ├── src/
│   │   │   │   ├── routes/     # Elysia.js route handlers
│   │   │   │   │   ├── docs.ts
│   │   │   │   │   └── health.ts
│   │   │   │   └── index.ts    # Server entry point
│   │   │   ├── tests/          # Server tests
│   │   │   └── package.json
│   │   └── e2e/               # End-to-end testing with Playwright
│   │       ├── tests/          # E2E test files
│   │       ├── playwright.config.ts
│   │       ├── run-tests.sh
│   │       └── package.json
│   ├── libraries/              # Domain-specific shared libraries (currently empty)
│   └── configs/                # Shared configuration packages
│       ├── eslint/             # ESLint configurations
│       │   └── package.json
│       ├── typescript/         # TypeScript configurations
│       │   └── package.json
│       └── prettier/           # Prettier configurations
│           └── package.json
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── package.json                # Root package.json with workspaces
├── turbo.json                  # TurboRepo configuration
├── bun.lockb                   # Bun lockfile
└── README.md                   # Project documentation
```

## Current Architecture Overview

- **TanStack Start**: Full-stack React framework with file-based routing and server-side rendering
- **Integrated Frontend + Backend**: The `web` app contains both frontend and backend (via TanStack Start)
- **Drizzle ORM**: Type-safe database schema and queries instead of Prisma
- **tRPC Integration**: Type-safe API layer with TanStack Start
- **TanStack DB Collections**: Live queries with ElectricSQL integration
- **Minimal External Server**: Separate `server` app for auxiliary services only

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
    "test": "turbo run test --filter=!@fanslib/e2e",
    "test:e2e": "turbo run test --filter=@fanslib/e2e",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "storybook": "turbo run storybook",
    "clean": "turbo run clean",
    "format": "turbo run format"
  },
  "devDependencies": {
    "turbo": "^2.5.6",
    "@types/node": "^22.10.5",
    "typescript": "^5.9.2"
  },
  "engines": {
    "bun": ">=1.0.0"
  },
  "packageManager": "bun@1.0.0"
}
```

**TurboRepo configuration (turbo.json):**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**", "storybook-static/**", ".tanstack/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "outputs": []
    },
    "test:headed": {
      "outputs": ["playwright-report/**", "test-results/**"]
    },
    "test:ui": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "outputs": []
    },
    "clean": {
      "cache": false
    },
    "format": {
      "outputs": []
    },
    "storybook": {
      "cache": false,
      "persistent": true
    }
  },
  "globalDependencies": ["**/.env.*local"],
  "globalEnv": ["NODE_ENV"]
}
```

## App Structure Details

### Web Application (@fanslib/web)

**Key Technologies:**
- **TanStack Start**: Full-stack React framework
- **TanStack Router**: File-based routing with type safety
- **TanStack DB**: Live queries with ElectricSQL
- **Drizzle ORM**: Database schema and type-safe queries
- **tRPC**: Type-safe API layer
- **Tailwind CSS + DaisyUI**: Styling framework
- **Jotai**: State management
- **Storybook**: Component development

**Package.json highlights:**

```json
{
  "name": "@fanslib/web",
  "scripts": {
    "dev": "docker compose up -d && vite dev",
    "build": "vite build && tsc --noEmit",
    "migrate": "drizzle-kit migrate",
    "migrate:generate": "drizzle-kit generate"
  },
  "dependencies": {
    "@tanstack/react-start": "^1.131.50",
    "@tanstack/electric-db-collection": "^0.1.23",
    "@tanstack/react-db": "^0.1.21",
    "@trpc/client": "^11.5.1",
    "@trpc/server": "^11.5.1",
    "drizzle-orm": "^0.44.5",
    "drizzle-zod": "^0.8.3"
  }
}
```

### Server Application (@fanslib/server)

**Purpose:** Auxiliary services and health checks
- Minimal Elysia.js server for non-web services
- Health monitoring endpoints
- Documentation endpoints
- Currently lightweight - most functionality integrated into web app

### E2E Testing (@fanslib/e2e)

**Purpose:** End-to-end testing with Playwright
- Cross-browser testing
- Integration testing
- User workflow validation
- Separate from unit tests for isolation

## Library Strategy

**Current State:** No domain libraries yet (libraries/ is empty)

**Future Plans:**
- Domain-specific libraries for shared business logic
- No build steps - pure TypeScript consumption
- Type-safe imports with workspace protocol
- Focus on domain models and utilities

## Development Workflow

**Common Commands:**

```bash
# Start development environment
bun dev

# Build all packages
bun build

# Generate database migrations
cd @fanslib/apps/web && bun migrate:generate

# Apply migrations
cd @fanslib/apps/web && bun migrate

# Run tests (excluding E2E)
bun test

# Run E2E tests
bun test:e2e

# Run Storybook
bun storybook

# Format code
bun format

# Type checking
bun typecheck
```

## Configuration Packages

**Shared configurations across the monorepo:**

- **@fanslib/eslint**: ESLint configurations for different environments
- **@fanslib/typescript**: TypeScript configurations (base, react, node)
- **@fanslib/prettier**: Prettier formatting configuration

**Usage in applications:**

```json
{
  "devDependencies": {
    "@fanslib/eslint": "workspace:*",
    "@fanslib/typescript": "workspace:*",
    "@fanslib/prettier": "workspace:*"
  }
}
```

## Key Architectural Decisions

1. **TanStack Start Integration**: Full-stack framework eliminates need for separate backend API
2. **Drizzle**: Better TypeScript integration and performance
3. **tRPC Integration**: Type-safe API layer with automatic serialization
4. **TanStack DB Collections**: Real-time data synchronization with ElectricSQL
5. **Minimal External Dependencies**: Self-contained applications with shared configuration only
6. **Docker Integration**: Database services managed via Docker Compose
7. **Playwright E2E Testing**: Comprehensive testing strategy with separate E2E package

This structure provides a modern, type-safe, and efficient development experience while maintaining clear separation of concerns and excellent developer experience.
