# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FansLib is an Electron application built with React and TypeScript for managing adult content creator libraries and post scheduling. The application uses a modular architecture with separate main and renderer processes.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Platform-specific builds
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux

# Code quality checks
npm run lint         # ESLint with auto-fix
npm run lint:check   # ESLint without auto-fix
npm run typecheck    # TypeScript type checking
npm run format       # Prettier formatting
npm run check        # Run all checks (format, lint, typecheck)

# Database
npm run schema:fetch # Fetch Postpone GraphQL schema
npm run codegen      # Generate Postpone GraphQL types

# Storybook (Component Development)
npm run storybook    # Start Storybook development server
npm run build-storybook # Build static Storybook

# Other utilities
npm run unused       # Find unused exports
npm run rebuild      # Rebuild native modules (sqlite3)
```

## Architecture

### Main Process (`src/main/`)

- Entry point: `src/main/index.ts`
- Handles Electron app lifecycle, window management, and IPC registration
- Uses TypeORM with SQLite for data persistence
- Custom protocol handlers for media and thumbnail serving

### Renderer Process (`src/renderer/`)

- Entry point: `src/renderer/src/main.tsx`
- React SPA with React Router for navigation
- TanStack Query for data fetching and caching
- Multiple context providers for state management
- shadcn/UI + Tailwind CSS for styling

### Features Architecture (`src/features/`)

Each feature module follows a consistent pattern:

- `entity.ts` - TypeORM entities
- `api-type.ts` - IPC type definitions
- `api.ts` - IPC handlers (main process)
- `operations.ts` - Business logic
- Individual feature modules: analytics, channels, library, posts, etc.

### Database

- SQLite database with TypeORM
- Automatic schema synchronization
- Entities cover media, posts, channels, tags, analytics, etc.

### IPC Communication

- Type-safe IPC using `src/features/index-main.ts` and `src/features/index-renderer.ts`
- Centralized handler registration via `IpcRegistry`
- All handlers follow consistent naming: `{feature}Methods`

## Key Technologies

- **Framework**: Electron + React + TypeScript
- **Build**: Vite + electron-vite
- **Database**: TypeORM + SQLite
- **UI**: Shadcn/ui & Radix UI primitives + Tailwind CSS
- **State**: React Context + TanStack Query
- **Routing**: React Router
- **Styling**: Tailwind CSS

## MCP Server for Electron Automation

A custom MCP server is available in `mcp-server/` that allows Claude Code to interact with the FansLib Electron application programmatically. This enables automated validation of changes.

### Setup MCP Server

```bash
cd mcp-server
./setup.sh
```

### Available Tools

- `electron_launch` - Launch the FansLib app
- `electron_close` - Close the app
- `electron_screenshot` - Take screenshots
- `electron_click` - Click elements
- `electron_type` - Type text
- `electron_wait` - Wait for elements
- `electron_evaluate` - Execute JavaScript
- `electron_get_text` - Get text content

See `mcp-server/README.md` for full documentation.

## Important Notes

- The app manages sensitive adult content libraries locally
- Uses custom protocols for secure media serving
- Implements cron jobs for analytics and automation
- GraphQL integration for external APIs (postpone service)
- Multi-platform support with platform-specific builds
- Reddit automation uses Playwright with headless Chrome for reliable browser automation
