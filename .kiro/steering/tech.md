# Technology Stack

## Build System & Package Management

- **Package Manager**: Bun (primary), npm fallback
- **Task Runner**: Task (Taskfile.yml) - preferred over npm scripts
- **Monorepo**: Workspace-based with packages in `packages/apps/*`, `packages/config/*`, `packages/lib/*`

## Frontend (Electron Renderer)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with electron-vite
- **UI Library**: Radix UI primitives + shadcn/ui components (shadcn/ui deprecated in favor of DaisyUI)
- **Styling**: Tailwind CSS 4.0 beta + DaisyUI
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router DOM v7 with hash routing
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts + Tremor
- **Date Handling**: date-fns
- **Animation**: Framer Motion

## Backend (Electron Main + Server)

- **Runtime**: Node.js with TypeScript
- **Electron**: v31+ for desktop app
- **Server Framework**: Elysia (Bun-first web framework)
- **Database**: SQLite with TypeORM
- **Automation**: Playwright for web scraping/posting
- **Scheduling**: node-cron for background jobs
- **Validation**: Zod schemas

## Development Tools

- **TypeScript**: v5.5+ with strict configuration
- **Linting**: ESLint 9 with TypeScript ESLint, functional programming rules (relaxed)
- **Formatting**: Prettier with 100 char line width, double quotes, semicolons
- **Testing**: Not present
- **Storybook**: Component development and documentation

## Common Commands

The taskfile is used for script management. NEVER use `npm run` to run scripts. ALWAYS use `task`

```bash
# Development
task dev                    # Start electron app + server
task electron:dev          # Electron app only
task server:dev            # Server only

# Building
task build                 # Build all packages

# Code Quality
task check                 # Run all checks (types, lint, format)
task check:types           # TypeScript type checking
task check:lint            # ESLint
task check:lint:fix        # Auto-fix linting issues
task check:format          # Prettier check
task check:format:fix      # Auto-format code

# Cleanup
task clean                 # Remove build artifacts
```

## Architecture Patterns

- **Feature-based organization**: Code organized by business domain in `src/features/`
- **API Layer**: Electron IPC with type-safe contracts
- **Context Providers**: React contexts for global state
- **Custom Hooks**: Business logic abstraction
- **Component Composition**: Radix UI + custom wrapper components
