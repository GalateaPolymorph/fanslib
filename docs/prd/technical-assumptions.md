# Technical Assumptions

## Repository Structure: Monorepo

**Decision**: Monorepo using Bun workspace management and TurboRepo for build optimization with organized package structure:

- **apps/**: Deployable applications (main FansLib web app, potential CLI tools, etc.)
- **libs/**: Single-responsibility libraries (features, API wrappers, utilities, domain logic)
- **configs/**: Shared configuration packages (ESLint, TypeScript, Prettier configs)

**Rationale**: Supports the integrated nature of FansLib components while maintaining clear separation between deployable artifacts, reusable libraries, and shared configurations. This structure enables efficient development workflows, shared dependencies, and promotes modular architecture with single-responsibility principle.

## Service Architecture

**Decision**: Monolith with modular architecture following functional programming principles
**Rationale**: For a solo creator tool with integrated workflows, monolithic architecture reduces complexity while modular design maintains code organization and testability. Functional programming approach aligns with stated preferences for pure functions and side effect management.

## Testing Requirements

**Decision**: Test-Driven Development with comprehensive testing pyramid (unit, integration, and end-to-end testing)
**Rationale**: TDD is mandatory per technical preferences. Given the critical nature of content management and posting prevention, comprehensive testing ensures reliability and prevents data loss or posting errors.

## Additional Technical Assumptions and Requests

- **Frontend Framework**: React with TypeScript (mandatory)
- **Package Management**: Bun for all dependency management and workspace coordination
- **Build System**: TurboRepo for monorepo build optimization and caching
- **Styling**: Tailwind CSS for utility-first styling approach
- **Component Library**: Daisy UI as primary component system, with Radix UI or React-Aria for accessible unstyled components when needed
- **Code Organization**: Functional programming principles with pure functions, const over let, map/reduce/filter over loops, no classes
- **Type System**: TypeScript types preferred over interfaces
- **Error Handling**: Result types instead of exceptions (using ts-belt library Result type, avoid try-catch patterns)
- **Code Quality**: ESLint for code quality enforcement and linting
- **Code Formatting**: Prettier for consistent code formatting across all packages
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Development Approach**: Test-driven development throughout all components
- **Side Effect Management**: Push side effects to application edges following functional programming principles
