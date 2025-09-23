# Deployment Architecture

## Deployment Strategy

**Target Platform:** Self-hosted Unraid server with Docker Compose

**Rationale:** Based on your self-hosted requirements and adult content privacy needs, FansLib deploys as a Docker Compose stack on your existing Unraid infrastructure. This approach provides complete control over sensitive content, eliminates cloud dependencies, and leverages your existing server investment while supporting specialized content management workflows.

**Frontend Deployment:**

- **Platform:** Docker container serves Tanstack Start app
- **Build Command:** `bun run build --filter=@fanslib/web`
- **Output Directory:** `@fanslib/apps/web/.output`
- **Serving Strategy:** Bun server running Tanstack Start app

**Backend Deployment:**

- **Platform:** Docker container with Bun runtime
- **Build Command:** `bun run build --filter=@fanslib/server`
- **Deployment Method:** Single container with integrated services
- **Process Management:** Bun server with background processes

## Production Docker Configuration

**docker/docker-compose.prod.yml: EXAMPLE**

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: fanslib-postgres
    environment:
      POSTGRES_DB: fanslib
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=C"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - /mnt/user/appdata/fanslib/postgres-backups:/backups
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d fanslib"]
      interval: 30s
      timeout: 10s
      retries: 3

  electric:
    image: electricsql/electric:latest
    container_name: fanslib-electric
    environment:
      DATABASE_URL: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/fanslib"
      ELECTRIC_WRITE_TO_PG_MODE: "logical_replication"
      PG_PROXY_PASSWORD: ${ELECTRIC_PROXY_PASSWORD}
    ports:
      - "5133:5133"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5133/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  fanslib:
    build:
      context: .
      dockerfile: docker/Dockerfile.prod
    container_name: fanslib-app
    environment:
      NODE_ENV: production
      DATABASE_URL: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/fanslib"
      ELECTRIC_URL: "http://electric:5133"
      MEDIA_ROOT: "/media"
      PORT: 3001
    volumes:
      - /mnt/user/media/fanslib:/media:ro # Mount your media directory
      - /mnt/user/appdata/fanslib:/app/data # Single data directory for thumbnails, logs, etc.
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      electric:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/user/appdata/fanslib/postgres

networks:
  default:
    name: fanslib-network
```

**Production Dockerfile (docker/Dockerfile.prod) EXAMPLE:**

```dockerfile
# Multi-stage build for production
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
COPY @fanslib/@fanslib/apps/server/package.json @fanslib/apps/server/
COPY @fanslib/@fanslib/apps/web/package.json @fanslib/apps/web/
COPY @fanslib/@fanslib/libraries/*/package.json @fanslib/libraries/
COPY @fanslib/@fanslib/configs/*/package.json @fanslib/configs/

RUN bun install --frozen-lockfile --production

# Build stage
FROM base AS build
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS production
WORKDIR /app

# Install system dependencies for media processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    imagemagick \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=build /app/@fanslib/apps/server/dist ./server
COPY --from=build /app/@fanslib/apps/web/dist ./public
COPY --from=build /app/node_modules ./node_modules

# Create non-root user
RUN groupadd -r fanslib && useradd -r -g fanslib fanslib
RUN chown -R fanslib:fanslib /app
USER fanslib

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001
CMD ["bun", "run", "server/index.js"]
```

## Unraid Integration

**Unraid Template (fanslib.xml):**

```xml
<?xml version="1.0"?>
<Container version="2">
  <Name>FansLib</Name>
  <Repository>fanslib:latest</Repository>
  <Registry>local</Registry>
  <Network>bridge</Network>
  <MyIP/>
  <Shell>bash</Shell>
  <Privileged>false</Privileged>
  <Support/>
  <Project/>
  <Overview>Content management platform for adult content creators</Overview>
  <Category>MediaApp:Other</Category>
  <WebUI>http://[IP]:[PORT:3001]</WebUI>
  <TemplateURL/>
  <Icon>https://raw.githubusercontent.com/your-repo/fanslib/main/docs/icon.png</Icon>
  <ExtraParams/>
  <PostArgs/>
  <CPUset/>
  <DateInstalled/>
  <DonateText/>
  <DonateLink/>
  <Description>
    FansLib is a comprehensive content management platform designed for adult content creators.
    It provides media organization, post scheduling, and multi-platform publishing capabilities.
  </Description>
  <Networking>
    <Mode>bridge</Mode>
    <Publish>
      <Port>
        <HostPort>3001</HostPort>
        <ContainerPort>3001</ContainerPort>
        <Protocol>tcp</Protocol>
      </Port>
    </Publish>
  </Networking>
  <Data>
    <Volume>
      <HostDir>/mnt/user/media/adult-content</HostDir>
      <ContainerDir>/media</ContainerDir>
      <Mode>ro</Mode>
    </Volume>
    <Volume>
      <HostDir>/mnt/user/appdata/fanslib</HostDir>
      <ContainerDir>/config</ContainerDir>
      <Mode>rw</Mode>
    </Volume>
    <Volume>
      <HostDir>/mnt/user/appdata/fanslib</HostDir>
      <ContainerDir>/app/data</ContainerDir>
      <Mode>rw</Mode>
    </Volume>
  </Data>
  <Environment>
    <Variable>
      <Value>production</Value>
      <Name>NODE_ENV</Name>
      <Mode/>
    </Variable>
    <Variable>
      <Value>/media</Value>
      <Name>MEDIA_ROOT</Name>
      <Mode/>
    </Variable>
    <Variable>
      <Value>your_postgres_password</Value>
      <Name>POSTGRES_PASSWORD</Name>
      <Mode/>
    </Variable>
  </Environment>
  <Labels/>
  <Config Name="WebUI Port" Target="3001" Default="3001" Mode="tcp" Description="Web interface port" Type="Port" Display="always" Required="true" Mask="false"/>
  <Config Name="Media Directory" Target="/media" Default="/mnt/user/media/adult-content" Mode="ro" Description="Directory containing your media files" Type="Path" Display="always" Required="true" Mask="false"/>
  <Config Name="App Data" Target="/config" Default="/mnt/user/appdata/fanslib" Mode="rw" Description="Application configuration and data" Type="Path" Display="always" Required="true" Mask="false"/>
</Container>
```

## CI/CD Pipeline

**.github/workflows/deploy.yaml:**

```yaml
name: Deploy to Unraid

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build applications
        run: |
          bun run build --filter=@fanslib/web
          bun run build --filter=@fanslib/server

      - name: Build Docker image
        run: |
          docker build -f docker/Dockerfile.prod -t fanslib:latest .

      - name: Login to Docker Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ secrets.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Push to Docker Registry
        run: |
          docker tag fanslib:latest ${{ secrets.DOCKER_REGISTRY }}/fanslib:latest
          docker tag fanslib:latest ${{ secrets.DOCKER_REGISTRY }}/fanslib:${{ github.sha }}
          docker push ${{ secrets.DOCKER_REGISTRY }}/fanslib:latest
          docker push ${{ secrets.DOCKER_REGISTRY }}/fanslib:${{ github.sha }}
```

**Manual Deployment on Unraid:**

After the CI/CD pipeline pushes to the Docker registry, manually update your Unraid container:

```bash
# Pull latest image
docker pull your-registry/fanslib:latest

# Update docker-compose.prod.yml to use your registry
# Then restart the container
cd /mnt/user/appdata/fanslib
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Management

**Production Environment Variables (.env.prod):**

```bash
# Database
POSTGRES_USER=fanslib
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL="postgresql://fanslib:your_secure_password_here@postgres:5432/fanslib"

# ElectricSQL
ELECTRIC_URL="http://electric:5133"
ELECTRIC_PROXY_PASSWORD=your_electric_password_here

# Application
NODE_ENV=production
PORT=3001
MEDIA_ROOT=/media
FRONTEND_URL=http://localhost:3001

# Paths
DATA_PATH=/app/data
```
