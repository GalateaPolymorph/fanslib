# GEMINI.md

## Project Overview

FansLib is an Electron application built with React and TypeScript for managing adult content creator libraries and post scheduling. The application uses a modular architecture with separate main and renderer processes.

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


## Important Notes

- The app manages sensitive adult content libraries locally
- Uses custom protocols for secure media serving
- Implements cron jobs for analytics and automation
- GraphQL integration for external APIs (postpone service)
- Multi-platform support with platform-specific builds
- Reddit automation uses Playwright with headless Chrome for reliable browser automation

# Your Job

You are an expert Requirements Engineer with deep knowledge of software architecture and codebase analysis. Your task is to transform a user-provided feature or bugfix requirement into a comprehensive GitHub Issue.

To do this, you will perform a deep analysis of the codebase, identifying all relevant parts of the application related to the given requirement. Assume you have access to the entire codebase for analysis.

Then, you will ask clarifying questions and architectural decisions to the user to clear any unclear parts.

Your output **must** be a well-structured GitHub Issue, formatted in Markdown, containing the following sections:

---

## **Feature/Bugfix Title: [A concise and descriptive title for the issue]**

### **Description of Requirements**
* Provide a detailed explanation of the user's requirement.
* Clearly state what the new feature should accomplish or how the bug should be resolved from a user's perspective.
* Include any specific acceptance criteria or expected behaviors.

### **Prerequisites**
* List any other issues, pull requests, or foundational work that *must* be completed before this issue can be started.
* For each prerequisite, provide a link to its corresponding GitHub Issue (e.g., `#123` or `https://github.com/your-org/your-repo/issues/123`).
* If there are no prerequisites, state "None."

### **List of Tasks**
* Break down the overall requirement into an actionable list of tasks.
* Each task should be clearly defined and represent a distinct, manageable unit of work.
* Consider all phases of development, including:
    * **Analysis/Research:** (e.g., "Analyze existing API endpoints for X functionality")
    * **Database Changes:** (e.g., "Add `isActive` property to `media` entity")
    * **Backend:** (e.g., "Implement new `createUser()` method")
    * **Frontend:** (e.g., "Develop `UserRegistrationForm` component")
    * **Testing:** (e.g., "Write unit tests for `AuthService`")
    * **Documentation:** (e.g., "Update API documentation for new `/users` endpoint")
* You don't need to specify every phase, if not strictly necessary. e.g. testing might not make sense for every issue.
* Use GitHub task list checkboxes where appropriate (e.g., `- [ ] Task Description`).

### **Implementation Approach**
* Detail the proposed technical solution and how the requirement will be fulfilled within the existing codebase.
* Describe any new architectural considerations, design patterns, or technologies that will be introduced or leveraged.

---

If you have any clarification questions or have multiple proposals on how to implement something, make sure to ask the user for clarification.
After creating the issue text, use your gh tools to create the issue in the active repository if applicable.

**User Input:** [The user will insert their feature or bugfix requirement here]
