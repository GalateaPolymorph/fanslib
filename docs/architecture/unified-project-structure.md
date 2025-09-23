# Unified Project Structure

**Monorepo Structure:** TurboRepo with Bun workspaces for optimal development and deployment

```
fanslib-web/                    # Project root
├── .bmad-core/                 # BMAD core configuration
│   └── core-config.yaml
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
│   │   ├── server/             # Media processing and background job server
│   │   │   ├── src/
│   │   │   │   ├── db/         # Database connection utilities
│   │   │   │   │   └── connection.ts
│   │   │   │   ├── modules/    # Domain-specific modules
│   │   │   │   │   ├── filesystem/ # File system operations
│   │   │   │   │   │   ├── fileScanner.ts
│   │   │   │   │   │   ├── fileScanner.test.ts
│   │   │   │   │   │   └── hash.ts
│   │   │   │   │   └── media/      # Media processing modules
│   │   │   │   │       ├── mediaProcessing.ts
│   │   │   │   │       ├── mediaProcessing.test.ts
│   │   │   │   │       ├── shootDetection.ts
│   │   │   │   │       ├── shootDetection.test.ts
│   │   │   │   │       ├── syncMedia.ts
│   │   │   │   │       ├── syncShoot.ts
│   │   │   │   │       ├── upsertMedia.ts
│   │   │   │   │       └── upsertShoot.ts
│   │   │   │   ├── routes/     # Elysia.js route handlers
│   │   │   │   │   ├── docs.ts
│   │   │   │   │   └── health.ts
│   │   │   │   ├── types/      # TypeScript type definitions
│   │   │   │   │   └── ffprobe.d.ts
│   │   │   │   └── index.ts    # Server entry point
│   │   │   ├── tests/          # Server tests
│   │   │   │   └── fixtures/   # Test fixtures
│   │   │   └── package.json
│   │   └── e2e/               # End-to-end testing with Playwright
│   │       ├── tests/          # E2E test files
│   │       ├── playwright.config.ts
│   │       ├── run-tests.sh
│   │       └── package.json
│   ├── libraries/              # Domain-specific shared libraries
│   │   ├── db/                 # Shared database schema and utilities
│   │   │   ├── src/
│   │   │   │   └── schema.ts   # Centralized Drizzle schema
│   │   │   ├── drizzle.config.ts
│   │   │   ├── index.ts        # Library entry point
│   │   │   └── package.json
│   │   └── utils/              # Shared utility functions
│   │       ├── src/
│   │       │   └── task.ts     # Task utilities
│   │       ├── index.ts        # Library entry point
│   │       └── package.json
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
- **Shared Database Library**: Centralized Drizzle ORM schema in `@fanslib/db`
- **Enhanced Server**: Dedicated media processing with filesystem scanning and metadata extraction
- **tRPC Integration**: Type-safe API layer with TanStack Start
- **TanStack DB Collections**: Live queries with ElectricSQL integration
- **Domain Libraries**: Shared utilities and database schemas across applications

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

## App Structure Details

### Web Application (@fanslib/web)

**Key Technologies:**
- **TanStack Start**: Full-stack React framework
- **TanStack Router**: File-based routing with type safety
- **TanStack DB**: Live queries with ElectricSQL
- **Drizzle ORM**: Database schema and type-safe queries (via `@fanslib/db`)
- **tRPC**: Type-safe API layer
- **Tailwind CSS + DaisyUI**: Styling framework
- **Jotai**: State management
- **Storybook**: Component development

### Server Application (@fanslib/server)

**Purpose:** Media processing, file system scanning, and background services
- **Media Processing**: Image and video metadata extraction using Sharp and FFprobe
- **File System Scanning**: Directory traversal and file discovery
- **Shoot Detection**: Automatic photo shoot grouping algorithms
- **Database Synchronization**: Media and shoot data persistence
- **Health Monitoring**: Service health endpoints
- **API Documentation**: Swagger/OpenAPI integration

**Key Dependencies:**
- **Elysia.js**: Fast web framework for APIs
- **Sharp**: High-performance image processing
- **FFprobe**: Video/audio metadata extraction
- **Glob**: File pattern matching
- **@fanslib/db**: Shared database schema
- **Zod**: Runtime type validation

### E2E Testing (@fanslib/e2e)

**Purpose:** End-to-end testing with Playwright
- Cross-browser testing
- Integration testing
- User workflow validation
- Separate from unit tests for isolation

## Library Strategy

**Current Libraries:**

### @fanslib/db
**Purpose:** Centralized database schema and configuration
- **Drizzle ORM Schema**: Shared table definitions
- **Type-safe Database Operations**: Consistent across applications
- **Migration Management**: Centralized schema evolution
- **Zod Integration**: Runtime validation for database models

### @fanslib/utils
**Purpose:** Shared utility functions
- **Task Utilities**: Common task management functions
- **Type-safe Utilities**: Reusable helper functions
- **No Build Steps**: Pure TypeScript consumption

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
2. **Centralized Database Schema**: `@fanslib/db` provides shared Drizzle schema across applications
3. **Enhanced Server Capabilities**: Dedicated media processing with filesystem operations
4. **tRPC Integration**: Type-safe API layer with automatic serialization
5. **TanStack DB Collections**: Real-time data synchronization with ElectricSQL
6. **Domain Libraries**: Shared business logic and utilities via workspace packages
7. **Docker Integration**: Database services managed via Docker Compose
8. **Playwright E2E Testing**: Comprehensive testing strategy with separate E2E package
9. **Media Processing Pipeline**: Automated file scanning, metadata extraction, and shoot detection

This structure provides a modern, type-safe, and efficient development experience while maintaining clear separation of concerns, shared libraries for common functionality, and excellent developer experience with enhanced media processing capabilities.
