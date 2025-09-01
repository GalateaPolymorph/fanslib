# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FansLib is a monorepo containing applications for managing adult content creator libraries and post scheduling. The repository is organized as a bun-managed workspace with clear separation between deployable applications and shared code.

## Coding Style Guidance (!!!VERY IMPORTANT!!!)

- Avoid using `let` and `for` loops in all cases
- Prefer pure, smaller helper functions for improved code readability and maintainability
- Focus on functional programming principles
- Break down complex logic into smaller, single-responsibility functions

## Anti-Patterns

- Avoid using singleton-classes, use module scope state instead

## Monorepo Structure

```
fanslib/
├── packages/
│   ├── apps/
│   │   ├── electron/          # Main Electron desktop application
│   │   └── server/            # Server application
│   ├── config/
│   │   └── eslint/            # Shared ESLint configuration
│   └── lib/
│       └── reddit-automation/ # Shared Reddit automation library
├── package.json               # Root workspace configuration
└── bun.lock                   # Bun lockfile
```

## Development Commands

All commands use Taskfile (Task runner). Run `task --list` to see all available tasks.

```bash
# Development
task dev                       # Start both electron and server development
task electron:dev              # Start electron app development server only
task server:dev                # Start server development only

# Building
task build                     # Build all apps for production

# Code quality
task check                     # Run all checks (types, lint, format) across all packages
task check:types               # Run TypeScript checks across all packages
task check:lint                # Run linting across all packages
task check:lint:fix            # Run linting with auto-fix across all packages
task check:format              # Check formatting across all packages
task check:format:fix          # Format code across all packages

# Utilities
task clean                     # Clean all build artifacts
task --list                    # List all available tasks
```

## Applications

### Electron App (`packages/apps/electron/`)

- Main desktop application for content management
- Built with Electron + React + TypeScript
- See `packages/apps/electron/CLAUDE.md` for detailed information

### Server App (`packages/apps/server/`)

- Server application component
- Built with TypeScript
- Dockerized deployment support

## Shared Libraries

### Reddit Automation (`packages/lib/reddit-automation/`)

- Shared library for Reddit automation functionality
- Used by the Electron app for Reddit posting capabilities
- Built with Playwright for browser automation

### ESLint Config (`packages/config/eslint/`)

- Shared ESLint configuration for all packages
- Provides consistent linting rules across the monorepo

## Key Technologies

- **Package Manager**: Bun with workspaces
- **Monorepo Structure**: Apps and libraries with shared configurations
- **Build System**: Individual app build configurations using Vite and electron-vite
- **TypeScript**: Shared configuration with app-specific overrides
- **Task Runner**: Taskfile (alternative to npm scripts)
- **Linting**: Shared ESLint configuration across packages
- **Automation**: Playwright for browser automation in Reddit functionality
