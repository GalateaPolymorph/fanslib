# Project Structure

## Monorepo Organization

```
packages/
├── apps/
│   ├── electron/          # Main desktop application
│   └── server/            # Background job server
├── config/
│   └── eslint/            # Shared ESLint configurations
└── lib/
    └── reddit-automation/ # Reddit posting automation library
```

## Electron App Structure (`packages/apps/electron/`)

### Main Process (`src/main/`)

- `index.ts` - Main electron process entry point
- `IpcRegistry.ts` - IPC channel registration and routing
- `media-protocol.ts` - Custom protocol for media file serving
- `thumbnail-protocol.ts` - Custom protocol for thumbnail serving

#### Feature Organization (`src/features/`)

Each feature follows this pattern:

- `api-type.ts` - TypeScript interfaces for IPC
- `api.ts` - IPC handlers (main process)
- `operations.ts` - Business logic
- `entity.ts` - Database entities (TypeORM)

The features are backend (main-process) only and should not be imported in the renderer, except for the api-type.ts

**Key Features:**

- `analytics/` - Performance tracking and insights
- `library/` - Media file management and scanning
- `posts/` - Content scheduling and management
- `channels/` - Platform integrations (Reddit, OnlyFans, etc.)
- `tags/` - Content tagging system
- `shoots/` - Photo/video shoot organization
- `settings/` - Application configuration

### Preload (`src/preload/`)

- `index.ts` - Preload script for secure renderer communication
- `api-type.ts` - Type definitions for IPC API

### Renderer (`src/renderer/src/`)

#### Core Application

- `App.tsx` - Root component with providers and routing
- `Layout.tsx` - Main application layout
- `main.tsx` - React app entry point

#### UI Components (`src/renderer/src/components/`)

- `ui/` - Base UI components (shadcn/ui style, shadcn/ui deprecated, use DaisyUI instead)
- Feature-specific components organized by domain
- Shared components at root level

#### Pages (`src/renderer/src/pages/`)

- Route components organized by feature
- Each page may have subpages in nested folders

#### Contexts (`src/renderer/src/contexts/`)

- React context providers for global state
- Named with `Context.tsx` suffix

#### Hooks (`src/renderer/src/hooks/`)

- Custom React hooks organized by category
- `api/` - Data fetching hooks
- `business/` - Business logic hooks
- `ui/` - UI interaction hooks

#### IPC

Use `window.api['scope:method']()` to access IPC API in the renderer

## Server Structure (`packages/apps/server/`)

### Core (`src/`)

- `main.ts` - Server entry point
- `types.ts` - Shared type definitions

### Database (`src/database/`)

- `config.ts` - Database configuration
- `entities.ts` - TypeORM entity exports

### Services (`src/services/`)

- `reddit-poster.ts` - Reddit automation service
- `cron-scheduler.ts` - Background job scheduling
- `queue-service.ts` - Job queue management
- `session-service.ts` - User session handling

## Shared Library (`packages/lib/reddit-automation/`)

### Core (`src/core/`)

- `browser.ts` - Playwright browser management
- `login.ts` - Reddit authentication
- `submit.ts` - Post submission logic
- `selectors.ts` - DOM selectors for Reddit
- `validate.ts` - Input validation

### Types (`src/types/`)

- Interface definitions for automation

## Configuration Files

### Root Level

- `Taskfile.yml` - Task runner configuration
- `package.json` - Workspace configuration
- `.prettierrc` - Code formatting rules
- `tsconfig.json` - TypeScript project references

### Per Package

- Each package has its own `package.json`, `tsconfig.json`, `Taskfile.yml`
- Electron app includes `electron.vite.config.ts` for build configuration

## Naming Conventions

- **Files**: kebab-case for regular files, PascalCase for React components
- **Directories**: kebab-case
- **Components**: PascalCase with descriptive names
- **Hooks**: camelCase starting with `use`
- **Contexts**: PascalCase ending with `Context`
- **Types/Interfaces**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE
