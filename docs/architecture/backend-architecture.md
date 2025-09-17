# Backend Architecture

## Service Architecture

**Organization Strategy:** Functional modules organized by domain with pure functions

```
apps/server/src/
├── routes/                 # Elysia.js route handlers
│   ├── media.ts                    # Media management endpoints
│   ├── posts.ts                    # Post composition endpoints
│   ├── channels.ts                 # Channel management endpoints
│   ├── tags.ts                     # Tagging system endpoints
│   └── electric.ts                 # ElectricSQL proxy routes
├── modules/                # Business logic modules
│   ├── media/                      # Media management functions
│   ├── posts/                      # Post composition functions
│   ├── scheduling/                 # Content scheduling functions
│   ├── tagging/                    # Multi-dimensional tagging functions
│   └── filesystem/                 # File system operations
├── background/             # Background processes
│   ├── fileWatcher.ts              # File system monitoring
│   ├── thumbnailGenerator.ts       # Media thumbnail generation
│   └── redditAutomation.ts         # Reddit posting automation
├── database/               # Database access layer
│   ├── prisma.ts                   # Prisma client setup
│   ├── electric.ts                 # ElectricSQL configuration
│   └── migrations/                 # Database migrations
├── utils/                  # Backend utilities
│   ├── mediaProcessing.ts          # Media file processing
│   ├── hashGenerator.ts            # Content hash generation
│   ├── dateHelpers.ts              # Date/time utilities
│   └── validation.ts               # Input validation functions
└── server.ts               # Main server entry point
```

## Functional Module Pattern

**Standard Module Structure:**

```typescript
// modules/media/mediaOperations.ts
import { prisma } from "../../database/prisma";
import { generateContentHash } from "../../utils/hashGenerator";
import { extractMetadata } from "../../utils/mediaProcessing";

// Pure functions for media operations
export const scanDirectory = async (directoryPath: string) => {
  const files = await fs.readdir(directoryPath, { recursive: true });
  const mediaFiles = files.filter(isMediaFile);

  return Promise.all(
    mediaFiles.map(async (filePath) => {
      const metadata = await extractMetadata(filePath);
      const contentHash = await generateContentHash(filePath);

      return {
        filepath: filePath,
        ...metadata,
        contentHash,
      };
    })
  );
};

export const syncMediaToDatabase = async (mediaItems: MediaMetadata[]) => {
  return prisma.$transaction(
    mediaItems.map((item) =>
      prisma.media.upsert({
        where: { filepath: item.filepath },
        update: {
          contentHash: item.contentHash,
          fileModifiedAt: item.fileModifiedAt,
        },
        create: item,
      })
    )
  );
};

export const assignMediaToShoot = async (
  mediaId: string,
  shootId: string | null
) => {
  return prisma.media.update({
    where: { id: mediaId },
    data: { shootId },
  });
};
```

## Route Handler Pattern

**Elysia.js Route Organization:**

```typescript
// routes/media.ts
import { Elysia, t } from "elysia";
import {
  scanDirectory,
  syncMediaToDatabase,
  assignMediaToShoot,
} from "../modules/media/mediaOperations";
import { generateThumbnails } from "../modules/media/thumbnailGeneration";

export const mediaRoutes = new Elysia({ prefix: "/api/media" })
  .post(
    "/scan",
    async ({ body }) => {
      try {
        const mediaItems = await scanDirectory(
          body.path || process.env.MEDIA_ROOT
        );
        const syncResult = await syncMediaToDatabase(mediaItems);

        // Trigger thumbnail generation in background
        generateThumbnails(syncResult.filter((item) => !item.thumbnailPath));

        return {
          success: true,
          scannedCount: mediaItems.length,
          addedCount: syncResult.filter((r) => r.created).length,
          updatedCount: syncResult.filter((r) => r.updated).length,
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        path: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/:id/shoot",
    async ({ params, body }) => {
      const result = await assignMediaToShoot(params.id, body.shootId);
      return { success: true, media: result };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        shootId: t.Union([t.String(), t.Null()]),
      }),
    }
  );
```

## Integrated Server Setup

**Single Bun Process with Multiple Concerns:**

```typescript
// server.ts
import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { cors } from "@elysiajs/cors";

import { mediaRoutes } from "./routes/media";
import { postRoutes } from "./routes/posts";
import { electricProxy } from "./routes/electric";
import { startFileWatcher } from "./background/fileWatcher";
import { startThumbnailQueue } from "./background/thumbnailGenerator";

const app = new Elysia()
  // CORS for frontend communication
  .use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
    })
  )

  // Static file serving for React app
  .use(
    staticPlugin({
      assets: "dist",
      prefix: "/",
    })
  )

  // API routes
  .use(mediaRoutes)
  .use(postRoutes)

  // ElectricSQL proxy
  .use(electricProxy)

  // Health check
  .get("/health", () => ({ status: "healthy", timestamp: new Date() }))

  // SPA fallback - serve index.html for client-side routing
  .get("*", () => Bun.file("dist/index.html"))

  .listen(process.env.PORT || 3001);

// Start background processes
startFileWatcher(process.env.MEDIA_ROOT || "/media");
startThumbnailQueue();

console.log(
  `🚀 FansLib server running on http://localhost:${app.server?.port}`
);
```

## Background Process Integration

**File System Monitoring:**

```typescript
// background/fileWatcher.ts
import chokidar from "chokidar";
import {
  scanDirectory,
  syncMediaToDatabase,
} from "../modules/media/mediaOperations";
import { generateThumbnails } from "../modules/media/thumbnailGeneration";

export const startFileWatcher = (watchPath: string) => {
  const watcher = chokidar.watch(watchPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  });

  watcher
    .on("add", async (filePath) => {
      console.log(`New file detected: ${filePath}`);
      await handleFileChange(filePath, "added");
    })
    .on("change", async (filePath) => {
      console.log(`File changed: ${filePath}`);
      await handleFileChange(filePath, "modified");
    })
    .on("unlink", async (filePath) => {
      console.log(`File removed: ${filePath}`);
      await handleFileRemoval(filePath);
    });

  console.log(`📁 Watching for file changes in: ${watchPath}`);
};

const handleFileChange = async (
  filePath: string,
  changeType: "added" | "modified"
) => {
  try {
    const mediaItems = await scanDirectory(path.dirname(filePath));
    const changedItem = mediaItems.find((item) => item.filepath === filePath);

    if (changedItem) {
      await syncMediaToDatabase([changedItem]);

      // Generate thumbnail for new files
      if (changeType === "added") {
        await generateThumbnails([changedItem]);
      }
    }
  } catch (error) {
    console.error(`Error processing file change for ${filePath}:`, error);
  }
};
```

## ElectricSQL Proxy Integration

**Real-time Data Sync Proxy:**

```typescript
// routes/electric.ts
import { Elysia } from "elysia";
import { Electric } from "electric-sql";

const electric = new Electric({
  url: process.env.ELECTRIC_URL || "http://localhost:5133",
});

export const electricProxy = new Elysia({ prefix: "/api/electric" })
  .all("/*", async ({ request }) => {
    // Proxy all requests to ElectricSQL server
    const url = new URL(request.url);
    url.hostname = "localhost";
    url.port = "5133";
    url.pathname = url.pathname.replace("/api/electric", "");

    return fetch(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
  })

  // Shape endpoints with filtering
  .get("/shapes/media", async ({ query }) => {
    const shape = await electric.db.media.sync({
      where: query.where ? JSON.parse(query.where) : undefined,
      include: {
        shoot: true,
        tags: {
          include: {
            tagValue: {
              include: {
                dimension: true,
              },
            },
          },
        },
      },
    });

    return shape;
  });
```

## Database Access Layer

**Prisma Client with ElectricSQL Integration:**

```typescript
// database/prisma.ts
import { PrismaClient } from "@prisma/client";
import { electrify } from "electric-sql/prisma";

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// ElectricSQL integration
export const electric = await electrify(
  prisma,
  process.env.ELECTRIC_URL || "http://localhost:5133"
);

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
```
