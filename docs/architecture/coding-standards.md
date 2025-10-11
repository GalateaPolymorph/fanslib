# Coding Standards

These standards are **MANDATORY for AI agents** and directly control AI developer behavior. This document provides critical rules needed to prevent bad code and ensure consistent development patterns across the FansLib Content Management Platform.

## Core Standards

- **Languages & Runtimes:** TypeScript (latest) with Bun runtime for backend, React (latest) for frontend
- **Style & Linting:** ESLint + Prettier with TypeScript-strict configuration, Tailwind CSS for styling
- **Test Organization:** `*.test.ts` files co-located with source files, comprehensive test coverage required

## Naming Conventions

| Element     | Convention                        | Example                                   |
| ----------- | --------------------------------- | ----------------------------------------- |
| Components  | PascalCase                        | `ContentBrowser`, `MediaThumbnail`        |
| Functions   | camelCase with descriptive verbs  | `scanContentLibrary`, `calculateRunway`   |
| Variables   | camelCase with auxiliary verbs    | `isLoading`, `hasError`, `canSchedule`    |
| Types       | PascalCase with descriptive names | `MediaItem`, `PostEntity`, `TagDimension` |
| Files (components)       | PascalCase                        | `ContentBrowser.tsx` |
| Files (non-components)       | kebab-case                        |  `media-scanning.ts` |
| Directories | kebab-case                        | `components/content-management`           |

## Critical Rules

- **KEEP IT SIMPLE** - Avoid unnecessary complexity and over-engineering, only use what is strictly and exactly necessary to fulfill the requirements. Don't prepare for possible future requirements. YAGNI.
- **FILE LENGTH LIMITS** - Keep files focused and manageable. No single file should exceed 200 lines. When a file grows beyond this limit, immediately refactor by extracting related functionality into separate modules (types, utilities, business logic, etc.)
- **MODULAR ARCHITECTURE** - Split large files into focused modules with single responsibilities. Extract types into separate files, create utility modules for helpers, and separate business logic from route definitions
- **Only use comments when explaining complex logic** or non-obvious code, NEVER use comments for simple explanations or to describe obvious code. When it comes to comments: **Avoid excessive commenting**, keep code self-explanatory and concise. WHY, not HOW and WHAT.
- **Prefer types over interfaces** - Use `type` for union types and complex compositions
- **All API responses must use standardized wrapper types** - Implement consistent error handling and response formatting
- **Database queries must use Drizzle ORM only** - Never write raw SQL, leverage type-safe database access
- **Never use for loops** - Always use `.map()`, `.reduce()`, `.forEach()` with helper functions for functional programming
- **Use early returns over nested if/else** - Improve code readability and reduce complexity
- **No default exports** - Always use named exports for better refactoring and IDE support
- **Use Effect.ts for backend error handling, effect composition and control flow** - The backend server is based on Effect.ts for comprehensive error handling, effect composition and general control flow patterns. Never throw exceptions, always use Effect types for operations that can fail
- **Use descriptive variable names with auxiliary verbs** - `isLoading`, `hasError`, `canSchedule` over generic names
- **Event handlers should not use "handle" prefix** - Name functions after the action they perform, not the event they handle
- **Always use arrow functions over function keyword** - Prevent hoisting issues and benefit from lexical scoping
- **Organize files systematically** - Each file should contain only related content (components, helpers, types). Split files when they exceed 200 lines or handle multiple responsibilities
- **Avoid enums, use maps instead** - Better type safety and flexibility for configuration values
- **All mutations must be optimistic with rollback** - Provide immediate UI feedback with error recovery through Tanstack DB
- **UI components must follow folder structure pattern** - Each UI component gets its own folder containing: Component.tsx, index.ts for exports, and Component.stories.ts for Storybook

## Language-Specific Guidelines

### TypeScript Specifics

- **Use strict type annotations** - Avoid `any`, prefer specific types or `unknown`
- **Leverage union types for state management** - Use discriminated unions for complex state
- **Use Effect types for error handling** - Define structured error types as TaggedError, never use Error classes
- **Use utility types effectively** - `Partial<T>`, `Pick<T>`, `Omit<T>` for type transformations

### React Specifics

- **Use functional components only** - No class components, leverage hooks for state management
- **Implement proper error boundaries** - Catch and handle component errors gracefully
- **Prefer custom hooks for logic reuse** - Extract complex logic into reusable hooks
- **Use Suspense for async operations** - Proper loading states for data fetching

### Bun/Backend Specifics

- **Use Elysia.js routing patterns** - Leverage framework's TypeScript inference capabilities. Split route files by domain and extract business logic into separate controller modules
- **Modular route organization** - Keep route files under 200 lines by extracting validation schemas, business logic, and type definitions into separate modules
- **Implement proper middleware chains** - Request validation, error handling, logging
- **Use Drizzle transactions for data consistency** - Ensure atomicity for complex operations
- **Leverage Bun's built-in APIs** - File system operations, HTTP client, testing framework
- **Implement graceful shutdown handling** - Proper cleanup for background processes

These standards ensure consistent, maintainable, and error-free code generation across the entire FansLib platform. All AI development agents must strictly adhere to these rules when generating or modifying code.
