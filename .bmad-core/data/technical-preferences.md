<!-- Powered by BMAD™ Core -->

# User-Defined Preferred Patterns and Preferences

## Programming Languages & Frameworks

- **TypeScript**: Primary programming language (mandatory)
- **React**: Frontend framework
- **BUN**: Package management system and MonoRepo workspace management
- **TurboRepo**: MonoRepo patterns and tooling

## Architecture & Development Patterns

- **Functional Programming Principles** (CRITICAL):
  - Use only pure functions where applicable
  - Push side effects to the edge of the application
  - Always prefer `const` over `let`
  - Always prefer `map`, `reduce`, and `filter` over for loops
  - Avoid classes - use alternative patterns to replace them
- **Type System**: Prefer `type` keywords over `interfaces`
- **Test-Driven Development**: Mandatory approach

## Code Organization & Naming

- **Code Organization**: Specific principles to be defined later
- **Naming Conventions**: Follow standard TypeScript and React ecosystem conventions

## Tooling & Infrastructure

- **CI/CD**: GitHub Actions
- **Deployment Targets**: No specific preference
- **Databases**: No specific preference

## UI/UX Technology Stack

- **Styling**: Tailwind CSS
- **Component Library**: Daisy UI (primary)
- **Accessible Components**: Radix UI or React-Aria components as unstyled, accessible bases when needed
