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
docker-compose up -d postgres electric

# Run database migrations
cd @fanslib/apps/server
bun run prisma migrate dev

# Generate Prisma client
bun run prisma generate

# Build shared libraries and configs
cd ../../..
bun run build --filter=@fanslib/ui
bun run build --filter=@fanslib/media
bun run build --filter=@fanslib/eslint
```

**Development Commands:**

```bash
# Start all services in parallel (recommended)
bun run dev

# Individual service commands
bun run dev --filter=@fanslib/web      # Frontend only
bun run dev --filter=@fanslib/server   # Backend only
bun run dev --filter=@fanslib/storybook # Storybook only

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

## Environment Configuration

**Required Environment Variables:**

```bash
# Frontend (.env.local or apps/web/.env.local)
VITE_API_URL=http://localhost:3001
VITE_ELECTRIC_URL=http://localhost:3001/api/electric

# Backend (apps/server/.env)
DATABASE_URL="postgresql://username:password@localhost:5432/fanslib"
ELECTRIC_URL="http://localhost:5133"
MEDIA_ROOT="/path/to/your/media/files"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Shared (root .env)
NODE_ENV=development
```

**Docker Development Environment:**

```yaml
# docker-compose.yml
version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: fanslib
      POSTGRES_USER: fanslib
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  electric:
    image: electricsql/electric:latest
    environment:
      DATABASE_URL: "postgresql://fanslib:password@postgres:5432/fanslib"
      ELECTRIC_WRITE_TO_PG_MODE: "logical_replication"
    ports:
      - "5133:5133"
    depends_on:
      - postgres

volumes:
  postgres_data:
```
