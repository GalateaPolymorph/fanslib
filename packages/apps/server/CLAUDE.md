# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the FansLib server application.

## Server Overview

The FansLib server is a lightweight backend application built with Elysia and Bun. It's designed to handle background jobs and provide API endpoints for the FansLib ecosystem. The server is containerized with Docker for easy deployment.

## Architecture

- **Runtime**: Bun
- **Framework**: Elysia (modern TypeScript web framework)
- **Language**: TypeScript with ES modules
- **Containerization**: Docker with oven/bun base image
- **Port**: 3000 (configurable via PORT environment variable)

## Current Implementation

The server currently provides:

- Health check endpoint (`/health`) with status and uptime information
- Root endpoint (`/`) with basic server information
- Work-in-progress status indicating active development

## Development Commands

Use Taskfile commands for development:

```bash
task dev                       # Start development server with watch mode
task start                     # Start production server
task build                     # Build server for production
task check                     # Run all checks (types, lint, format)
task check:types               # TypeScript type checking
task check:lint                # ESLint checking
task check:lint:fix            # ESLint with auto-fix
task check:format              # Prettier format checking
task check:format:check        # Format code with Prettier
task push                      # Push to DockerHub
task clean                     # Clean build artifacts
```

## Dependencies

### Runtime Dependencies

- **elysia**: Modern TypeScript web framework
- **playwright**: Browser automation (for future background job functionality)

### Development Dependencies

- **@fanslib/eslint-config**: Shared ESLint configuration
- **typescript**: TypeScript compiler
- **prettier**: Code formatting
- **eslint**: Code linting

## Docker Deployment

The server is containerized and can be deployed using:

1. **Build image**: `docker build -t fanslib-server .`
2. **Run container**: `docker run -p 3000:3000 fanslib-server`
3. **Docker Compose**: Use `docker-compose.yml` for orchestrated deployment
4. **Push to registry**: Use `./push-to-dockerhub.sh` script

## File Structure

```
packages/apps/server/
├── src/
│   └── main.ts                # Main application entry point
├── Dockerfile                 # Docker container configuration
├── docker-compose.yml         # Docker Compose configuration
├── Taskfile.yml              # Task runner configuration
├── package.json              # Node.js dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── eslint.config.js          # ESLint configuration
└── push-to-dockerhub.sh      # Docker registry push script
```

## Development Guidelines

Follow the same coding style as the main project:

- Use arrow functions and functional programming principles
- Avoid `let` and `for` loops
- Prefer pure, smaller helper functions
- Use `const` for all variable declarations
- Follow TypeScript strict typing

## Future Development

The server is marked as "Work In Progress" and is intended to expand with:

- Background job processing
- Integration with Reddit automation library
- API endpoints for the Electron app
- Database connectivity
- Authentication and authorization

## Environment Variables

- `PORT`: Server port (default: 3000)

## Health Monitoring

The server provides a health check endpoint at `/health` that returns:

- Server status
- Current timestamp
- Process uptime

This endpoint can be used for container health checks and monitoring.
