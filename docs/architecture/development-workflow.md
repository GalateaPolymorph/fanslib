# Development Workflow

## Local Development Setup

**Prerequisites:**

```bash
# Install Bun (required)
curl -fsSL https://bun.sh/install | bash

# Install Docker and Docker Compose (for database and services)
# Follow platform-specific instructions

# Clone repository
git clone <repository-url>
cd fanslib
```

**Initial Setup:**

```bash
# Install all dependencies using Bun workspaces
bun install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start PostgreSQL and ElectricSQL via Docker
docker-compose up -d

# Run database migrations
cd @fanslib/apps/web
bun run migrate
```

**Development Commands:**

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
