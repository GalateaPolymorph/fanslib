# Fanslib — How to Deploy

## Architecture

| Component | Port | Description |
|-----------|------|-------------|
| Web (TanStack Start) | 7000 | Frontend + SSR |
| API (Hono/Bun) | 7500 | Backend API |
| Caddy | 80 | Reverse proxy → 7000 |

**Domain:** `fanslib.deepblush.garden`
**Server:** tsumetai (192.168.69.70), user `amelia`

## Port Schema

| Environment | Web | API |
|-------------|-----|-----|
| Production | 7000 | 7500 |
| Preview pr-1 | 7001 | 7501 |
| Preview pr-2 | 7002 | 7502 |

## Paths on tsumetai

```
/var/www/apps/fanslib/
├── production/
│   ├── .env                    ← ENV config
│   └── current/
│       ├── .env                ← Kopie von production/.env
│       ├── start-web.sh        ← PM2 wrapper (sources .env)
│       ├── start-api.sh        ← PM2 wrapper (sources .env)
│       ├── web/                ← TanStack Start build output
│       │   ├── server/server.js ← Web entry point
│       │   ├── client/          ← Static assets
│       │   ├── node_modules/    ← Runtime deps (h3-v2, react, etc.)
│       │   └── package.json
│       └── api/                ← Hono API build output
│           ├── index.js         ← API entry point (bundled)
│           ├── node_modules/    ← External deps (playwright, sharp, etc.)
│           └── package.json

/mnt/shares/appdata/fanslib/
├── library → /mnt/shares/Archive/Amy/Kreativ - NSFW/Content  (symlink)
└── (DB, uploads, etc.)

/workspace/projects/fanslib/node_modules/sql.js/dist/sql-wasm.wasm  ← Required by API (hardcoded path)
```

## ENV Variables

`/var/www/apps/fanslib/production/.env`:
```env
PORT=7000
API_URL=http://localhost:7500
API_PORT=7500
APPDATA_PATH=/mnt/shares/appdata/fanslib
LIBRARY_PATH=/mnt/shares/appdata/fanslib/library
NODE_ENV=production
TZ=Europe/Berlin
```

## Deploy Steps (Copy-Paste Ready)

### 1. Build (lokal im OpenClaw Container)

```bash
cd /workspace/projects/fanslib
bun run build
```

Build output:
- Web: `@fanslib/apps/web/dist/` (client + server dirs)
- API: `@fanslib/apps/server/dist/index.js`

### 2. rsync to tsumetai

```bash
cd /workspace/projects/fanslib

# Web
rsync -avz --delete -e "sshpass -p '12345678' ssh -o StrictHostKeyChecking=no" \
  @fanslib/apps/web/dist/ \
  amelia@192.168.69.70:/var/www/apps/fanslib/production/current/web/

# API
rsync -avz --delete -e "sshpass -p '12345678' ssh -o StrictHostKeyChecking=no" \
  @fanslib/apps/server/dist/ \
  amelia@192.168.69.70:/var/www/apps/fanslib/production/current/api/

# sql.js WASM (hardcoded path in bundle)
rsync -e "sshpass -p '12345678' ssh -o StrictHostKeyChecking=no" \
  node_modules/sql.js/dist/sql-wasm.wasm \
  amelia@192.168.69.70:/workspace/projects/fanslib/node_modules/sql.js/dist/sql-wasm.wasm
```

### 3. Copy ENV + Restart PM2

```bash
sshpass -p '12345678' ssh -o StrictHostKeyChecking=no amelia@192.168.69.70 '
  export PATH="$HOME/.bun/bin:$HOME/.local/bin:$PATH"
  cp /var/www/apps/fanslib/production/.env /var/www/apps/fanslib/production/current/.env
  pm2 restart fanslib-web fanslib-api
  pm2 save
'
```

### 4. Validate

```bash
sshpass -p '12345678' ssh -o StrictHostKeyChecking=no amelia@192.168.69.70 '
  export PATH="$HOME/.bun/bin:$HOME/.local/bin:$PATH"
  pm2 list
  curl -sI http://localhost:7000
  curl -s http://localhost:7500/health
  curl -sI http://localhost:80 -H "Host: fanslib.deepblush.garden"
'
```

## PM2 Processes

| Name | Script | CWD |
|------|--------|-----|
| fanslib-web | start-web.sh (→ bun run server.js) | .../current/web/server |
| fanslib-api | start-api.sh (→ bun run index.js) | .../current/api |

Start scripts source `.env` before running bun.

## Caddy Config

In `/etc/caddy/Caddyfile`:
```caddyfile
http://fanslib.deepblush.garden {
    reverse_proxy localhost:7000
}
```

After changes: `sudo systemctl reload caddy`

## Rollback

```bash
# Stop processes
pm2 stop fanslib-web fanslib-api

# Deploy previous version (rsync old build)
# Then restart
pm2 restart fanslib-web fanslib-api
pm2 save
```

## Known Issues

- **sql.js WASM path**: The API bundle has a hardcoded path to `/workspace/projects/fanslib/node_modules/sql.js/dist/sql-wasm.wasm`. This file must exist on tsumetai at that exact path. This should be fixed in the build config.
- **API /api proxy**: The web server doesn't proxy `/api` to the API server. The API is only accessible directly on port 7500. Client-side code should use `API_URL` env var.
- **Web runtime deps**: TanStack Start SSR doesn't fully bundle deps. `node_modules` must be installed in the web deploy dir. The `package.json` there lists all needed runtime deps including `h3-v2` (aliased to `npm:h3@2.0.0-beta.4`).

## First-Time Setup

These only need to be done once:

1. Symlink: `ln -s "/mnt/shares/Archive/Amy/Kreativ - NSFW/Content" /mnt/shares/appdata/fanslib/library`
2. Directories: `mkdir -p /var/www/apps/fanslib/production/current`
3. apps.json: Add fanslib entry to `/var/www/config/apps.json`
4. Caddy: Add fanslib block to Caddyfile + reload
5. Playwright: `bunx playwright install chromium && sudo bunx playwright install-deps chromium`
6. Web deps: `cd /var/www/apps/fanslib/production/current/web && bun install`
7. API deps: `cd /var/www/apps/fanslib/production/current/api && bun add sharp playwright playwright-core ffprobe-static fluent-ffmpeg`
