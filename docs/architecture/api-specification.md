# API Specification

Based on the chosen hybrid API approach (REST for mutations + ElectricSQL for real-time data sync), FansLib uses a **dual-channel architecture**:

1. **ElectricSQL Shapes** - Real-time data synchronization for queries and live updates
2. **REST API Endpoints** - Server-authoritative mutations and file operations

## ElectricSQL Shape Configuration

ElectricSQL handles all **read operations** and **real-time synchronization** through shape subscriptions. The Bun server acts as an ElectricSQL proxy with authentication and filtering.

### Media Shape

```typescript
// Electric proxy endpoint: GET /api/shapes/media
const mediaShape = {
  table: "media",
  columns: [
    "id",
    "filepath",
    "filesize",
    "contentHash",
    "dimensions",
    "duration",
    "mimeType",
    "fileCreatedAt",
    "fileModifiedAt",
    "createdAt",
    "updatedAt",
    "shootId",
    "thumbnailPath",
  ],
  // Optional filters can be applied via query params
  // where: 'shootId IS NOT NULL' (for filtered views)
};
```

### Posts Shape

```typescript
// Electric proxy endpoint: GET /api/shapes/posts
const postsShape = {
  table: "posts",
  columns: [
    "id",
    "title",
    "caption",
    "status",
    "date",
    "channelId",
    "subreddit",
    "url",
    "hashtags",
    "createdAt",
    "updatedAt",
  ],
};
```

### Channels Shape

```typescript
// Electric proxy endpoint: GET /api/shapes/channels
const channelsShape = {
  table: "channels",
  columns: [
    "id",
    "name",
    "type",
    "description",
    "defaultHashtags",
    "isActive",
    "createdAt",
    "updatedAt",
  ],
};
```

### Tags & Dimensions Shape

```typescript
// Electric proxy endpoint: GET /api/shapes/tags
const tagsShape = {
  table: "tag_dimensions",
  columns: ["id", "name", "isExclusive", "createdAt", "updatedAt"],
};

const tagValuesShape = {
  table: "tag_values",
  columns: ["id", "value", "dimensionId"],
};

const mediaTagsShape = {
  table: "media_tags",
  columns: ["mediaId", "tagValueId"],
};
```

## REST API Endpoints (Mutations)

All **write operations** go through REST endpoints to ensure server authority and proper validation. These endpoints return transaction IDs for ElectricSQL sync confirmation.

### Media Management

```typescript
// POST /api/media/scan
// Trigger file system scan
type ScanRequest = {
  path?: string; // Optional specific path, defaults to full scan
};
type ScanResponse = {
  success: boolean;
  scannedCount: number;
  addedCount: number;
  updatedCount: number;
  errors: string[];
  txid: number;
};

// PUT /api/media/:id/shoot
// Assign media to shoot
type AssignShootRequest = {
  shootId: string | null;
};
type AssignShootResponse = {
  success: boolean;
  txid: number;
};

// DELETE /api/media/:id
// Remove media from database (not file system)
type DeleteMediaResponse = {
  success: boolean;
  txid: number;
};
```

### Post Management

```typescript
// POST /api/posts
// Create new post
type CreatePostRequest = {
  title?: string;
  caption: string;
  channelId: string;
  subreddit?: string;
  mediaIds: string[];
  date?: Date;
};
type CreatePostResponse = {
  postId: string;
  txid: number;
};

// PUT /api/posts/:id
// Update existing post
type UpdatePostRequest = {
  title?: string;
  caption?: string;
  status?: PostStatus;
  date?: Date;
  subreddit?: string;
  url?: string;
};
type UpdatePostResponse = {
  success: boolean;
  txid: number;
};

// DELETE /api/posts/:id
type DeletePostResponse = {
  success: boolean;
  txid: number;
};
```

### Tagging Operations

```typescript
// POST /api/media/:id/tags
// Apply tags to media item
type ApplyTagsRequest = {
  tagValueIds: string[];
};
type ApplyTagsResponse = {
  success: boolean;
  txid: number;
};

// POST /api/tags/dimensions
// Create new tag dimension
type CreateTagDimensionRequest = {
  name: string;
  isExclusive: boolean;
};
type CreateTagDimensionResponse = {
  dimensionId: string;
  txid: number;
};

// POST /api/tags/dimensions/:id/values
// Add value to tag dimension
type AddTagValueRequest = {
  value: string;
};
type AddTagValueResponse = {
  valueId: string;
  txid: number;
};
```

## TanStack DB Integration

The frontend uses **TanStack DB Collections** with ElectricSQL integration for seamless real-time data management:

```typescript
// Media collection with optimistic updates
const mediaCollection = createCollection(
  electricCollectionOptions({
    id: "media",
    getKey: (item) => item.id,
    shapeOptions: {
      url: "/api/shapes/media",
    },
    onUpdate: async ({ transaction }) => {
      const updatedItem = transaction.mutations[0].modified;
      const response = await fetch(`/api/media/${updatedItem.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedItem),
      });
      const result = await response.json();
      return { txid: result.txid };
    },
  })
);

// Posts collection with post creation
const postsCollection = createCollection(
  electricCollectionOptions({
    id: "posts",
    getKey: (item) => item.id,
    shapeOptions: {
      url: "/api/shapes/posts",
    },
    onInsert: async ({ transaction }) => {
      const newPost = transaction.mutations[0].modified;
      const response = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
      });
      const result = await response.json();
      return { txid: result.txid };
    },
  })
);
```

## Architecture Benefits

**Real-time Synchronization:**

- File system changes instantly appear in UI via ElectricSQL
- Multi-device synchronization without complex state management
- Optimistic updates with automatic rollback on conflicts

**Server Authority:**

- All mutations validated and processed server-side
- Transaction IDs ensure proper sync confirmation
- File system operations remain server-controlled

**Performance:**

- No traditional API queries - data flows directly from PostgreSQL
- Efficient change detection via ElectricSQL shapes
- Local-first experience with TanStack DB caching
