# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FansLib is an Electron application built with React and TypeScript for managing adult content creator libraries and post scheduling. The application uses a modular architecture with separate main and renderer processes.

## Development Commands

```bash
# Start development server
npm run dev

# Start development server with fixtures (separate database)
npm run dev:fixtures

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

## Development Mode

The application supports a development mode that provides a completely separate database environment with comprehensive fixture data, allowing safe development without affecting production data.

### Activation

```bash
# Start development server with fixtures
npm run dev:fixtures

# Or set environment variable manually
DEVELOPMENT_MODE=true npm run dev
```

### Features

- **Separate Database**: Uses `fanslib-dev.sqlite` instead of `fanslib.sqlite`
- **Comprehensive Fixtures**: Automatically loads realistic test data for all entity types
- **Dummy Media Files**: Creates placeholder media files in `src/fixtures/media/`
- **Persistent Data**: Development database persists between sessions
- **Reset Capability**: Can reset development database and reload fixtures

### Fixture Data Includes

- **50+ Media files** with realistic metadata and dummy files
- **25+ Posts** across different platforms and statuses
- **8+ Channels** covering all platform types
- **Tag System** with dimensions, definitions, and associations
- **Analytics Data** with sample performance metrics
- **Hashtag Statistics** and channel-specific data
- **Content Schedules** and posting automation
- **Caption Snippets** and filter presets
- **Shoot Organization** and subreddit configurations

### Database Reset

The development database can be reset programmatically:

```typescript
import { resetDevelopmentDatabase } from "../lib/db";

// Only works when DEVELOPMENT_MODE=true
await resetDevelopmentDatabase();
```

### File Structure

```
src/fixtures/
├── index.ts              # Main fixture loader
├── media/                # Dummy media files
├── analytics.ts          # Analytics fixtures
├── channels.ts           # Channel fixtures
├── contentSchedules.ts   # Content schedule fixtures
├── filterPresets.ts      # Filter preset fixtures
├── hashtags.ts           # Hashtag fixtures
├── media.ts              # Media fixtures
├── posts.ts              # Post fixtures
├── shoots.ts             # Shoot fixtures
├── snippets.ts           # Caption snippet fixtures
├── subreddits.ts         # Subreddit fixtures
└── tags.ts               # Tag system fixtures
```

## Important Notes

- The app manages sensitive adult content libraries locally
- Uses custom protocols for secure media serving
- Implements cron jobs for analytics and automation
- GraphQL integration for external APIs (postpone service)
- Multi-platform support with platform-specific builds
- Reddit automation uses Playwright with headless Chrome for reliable browser automation
