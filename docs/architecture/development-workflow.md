# Development Workflow

**Development Commands:**

Development commands are intended to be run from the root directory of the project.

```bash
# Start all services in parallel (recommended)
bun run dev

# Individual service commands
bun run dev --filter=@fanslib/web      # Frontend only
bun run dev --filter=@fanslib/server   # Backend only

# Build commands
bun run build                          # Build all packages
bun run build --filter=@fanslib/web    # Build frontend only

# Testing
bun run test                           # Run all tests
bun run test --filter=@fanslib/web     # Frontend tests only
bun run test --filter=@fanslib/server  # Backend tests only

# Type checking
bun run typecheck                     # Check all packages

# Linting
bun run lint                           # Lint all packages
bun run lint --fix                     # Auto-fix linting issues
```
