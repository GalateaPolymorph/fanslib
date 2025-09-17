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
| Files       | kebab-case                        | `content-browser.tsx`, `media-scanner.ts` |
| Directories | kebab-case                        | `components/content-management`           |

## Critical Rules

- **Console.log usage restrictions** - Never use console.log in frontend packages (web, storybook). Backend packages (server) may use console.log for development and debugging purposes
- **All API responses must use standardized wrapper types** - Implement consistent error handling and response formatting
- **Database queries must use Prisma ORM only** - Never write raw SQL, leverage type-safe database access
- **No default exports** - Always use named exports for better refactoring and IDE support
- **Never use for loops** - Always use `.map()`, `.reduce()`, `.forEach()` with helper functions for functional programming
- **Use early returns over nested if/else** - Improve code readability and reduce complexity
- **All external API calls must implement retry logic** - Handle network failures gracefully with exponential backoff
- **Use Result types from ts-belt for error handling** - Never throw exceptions, always return `Result<T, E>` for operations that can fail
- **Use functional utilities from ts-belt wherever possible** - Leverage `pipe`, `Option`, `Array`, `Dict`, and other utilities for functional composition
- **Favor abstraction and modularization** - Follow DRY principles, create reusable utility functions
- **Use descriptive variable names with auxiliary verbs** - `isLoading`, `hasError`, `canSchedule` over generic names
- **Event handlers should not use "handle" prefix** - Name functions after the action they perform, not the event they handle
- **Always use arrow functions over function keyword** - Prevent hoisting issues and benefit from lexical scoping
- **Organize files systematically** - Each file should contain only related content (components, helpers, types)
- **All forms must use Zod validation** - Runtime type safety and consistent validation patterns
- **ElectricSQL shapes must be defined with proper error boundaries** - Handle sync failures gracefully
- **File system operations must return Result types** - Content scanning can fail, use `Result<T, E>` for proper error recovery
- **Use TypeScript strict mode** - Enable all strict type checking options for better code quality
- **Prefer types over interfaces** - Use `type` for union types and complex compositions
- **Avoid enums, use maps instead** - Better type safety and flexibility for configuration values
- **All mutations must be optimistic with rollback** - Provide immediate UI feedback with error recovery through Tanstack DB

## Language-Specific Guidelines

### TypeScript Specifics

- **Use strict type annotations** - Avoid `any`, prefer specific types or `unknown`
- **Leverage union types for state management** - Use discriminated unions for complex state
- **Use Result types for error handling** - Define structured error types as discriminated unions, never use Error classes
- **Use utility types effectively** - `Partial<T>`, `Pick<T>`, `Omit<T>` for type transformations
- **Define branded types for IDs** - Prevent mixing different ID types (MediaId, PostId, etc.)

### Functional Programming with ts-belt

- **Use pipe for data transformations** - `pipe(data, Array.map(fn), Array.filter(fn))` instead of chaining
- **Use Option for nullable values** - `Option<T>` instead of `T | null | undefined`
- **Use Dict utilities for object operations** - `Dict.map`, `Dict.filter` instead of Object methods
- **Use Array utilities for collections** - `Array.groupBy`, `Array.partition`, `Array.zip` for complex operations
- **Compose functions with pipe** - Build complex operations from simple, testable functions

### React Specifics

- **Use functional components only** - No class components, leverage hooks for state management
- **Implement proper error boundaries** - Catch and handle component errors gracefully
- **Use React.memo for expensive renders** - Optimize performance for large content lists
- **Prefer custom hooks for logic reuse** - Extract complex logic into reusable hooks
- **Use Suspense for async operations** - Proper loading states for data fetching

### Bun/Backend Specifics

- **Use Elysia.js routing patterns** - Leverage framework's TypeScript inference capabilities
- **Implement proper middleware chains** - Request validation, error handling, logging
- **Use Prisma transactions for data consistency** - Ensure atomicity for complex operations
- **Leverage Bun's built-in APIs** - File system operations, HTTP client, testing framework
- **Implement graceful shutdown handling** - Proper cleanup for background processes

These standards ensure consistent, maintainable, and error-free code generation across the entire FansLib platform. All AI development agents must strictly adhere to these rules when generating or modifying code.
