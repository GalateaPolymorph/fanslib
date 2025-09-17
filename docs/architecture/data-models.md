# Data Models

Define the core data models/entities that will be shared between frontend and backend. Based on PRD requirements, the key business entities are identified with their purpose, relationships, and TypeScript type definitions.

## Media

**Purpose:** Represents individual media files (images/videos) with metadata and relationships

**Key Attributes:**

- `id`: string - Unique identifier
- `filepath`: string - Full path to file on disk
- `filesize`: number - File size in bytes
- `contentHash`: string - File content hash for change detection
- `dimensions`: object - Width/height for images/videos
- `duration`: number | null - Video duration in seconds
- `mimeType`: string - File MIME type
- `fileCreatedAt`: Date - File system creation date
- `fileModifiedAt`: Date - File system modification date
- `createdAt`: Date - Database record creation
- `updatedAt`: Date - Database record update
- `shootId`: string | null - Associated shoot ID
- `thumbnailPath`: string - Generated thumbnail path
- `tags`: TagValue[] - Multi-dimensional tag assignments

### TypeScript Interface

```typescript
type Media = {
  id: string;
  filepath: string;
  filesize: number;
  contentHash: string;
  dimensions: { width: number; height: number };
  duration: number | null;
  mimeType: string;
  fileCreatedAt: Date;
  fileModifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  shootId: string | null;
  thumbnailPath: string;

  // Relations
  shoot?: Shoot;
  postMediaItems?: PostMediaItem[];
  tags?: MediaTag[];
};
```

### Relationships

- Belongs to one Shoot (optional)
- Can appear in multiple Posts via PostMediaItem junction
- Has many TagValues via MediaTag junction

## Shoot

**Purpose:** Groups related content from the same photo/video session

**Key Attributes:**

- `id`: string - Unique identifier
- `name`: string - Shoot name (from folder or manual)
- `date`: Date - Shoot date
- `description`: string | null - Optional description
- `folderPath`: string | null - Source folder path if auto-detected

### TypeScript Interface

```typescript
type Shoot = {
  id: string;
  name: string;
  date: Date;
  description: string | null;
  folderPath: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  media: Media[];
};
```

### Relationships

- Has many Media items

## Post

**Purpose:** Represents a publishable post containing multiple media items with metadata

**Key Attributes:**

- `id`: string - Unique identifier
- `title`: string | null - Optional title (for ManyVids, Clips4Sale)
- `caption`: string - Post caption/description
- `status`: PostStatus - Draft, scheduled, published, archived
- `date`: Date | null - Scheduled or published date
- `channelId`: string - Target channel
- `subreddit`: string | null - For Reddit channels
- `url`: string | null - Published post URL
- `hashtags`: string[] - Parsed hashtags from caption

### TypeScript Interface

```typescript
type PostStatus = "draft" | "scheduled" | "published" | "archived";

type Post = {
  id: string;
  title: string | null;
  caption: string;
  status: PostStatus;
  date: Date | null;
  channelId: string;
  subreddit: string | null;
  url: string | null;
  hashtags: string[];
  createdAt: Date;
  updatedAt: Date;

  // Relations
  channel: Channel;
  mediaItems: PostMediaItem[];
};
```

### Relationships

- Belongs to one Channel
- Has many Media items via PostMediaItem junction

## Channel

**Purpose:** Represents posting destinations with platform-specific configuration

**Key Attributes:**

- `id`: string - Unique identifier
- `name`: string - Channel display name
- `type`: ChannelType - Platform type
- `description`: string | null - Optional description
- `defaultHashtags`: string[] - Default hashtags for this channel
- `isActive`: boolean - Whether channel is currently used

### TypeScript Interface

```typescript
type ChannelType =
  | "fansly"
  | "manyvids"
  | "reddit"
  | "bluesky"
  | "redgifs"
  | "clips4sale";

type Channel = {
  id: string;
  name: string;
  type: ChannelType;
  description: string | null;
  defaultHashtags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  posts: Post[];
  schedules: ContentSchedule[];
};
```

### Relationships

- Has many Posts
- Has many ContentSchedules

## TagDimension & TagValue

**Purpose:** Custom multi-dimensional tagging system for content organization

### TypeScript Interface

```typescript
type TagDimension = {
  id: string;
  name: string;
  isExclusive: boolean; // Can only select one value vs multiple
  values: TagValue[];
  createdAt: Date;
  updatedAt: Date;
};

type TagValue = {
  id: string;
  value: string;
  dimensionId: string;

  // Relations
  dimension: TagDimension;
  mediaTags: MediaTag[];
};

type MediaTag = {
  mediaId: string;
  tagValueId: string;

  // Relations
  media: Media;
  tagValue: TagValue;
};
```

### Relationships

- TagDimension has many TagValues
- Media has many TagValues via MediaTag junction

## Junction Tables

```typescript
type PostMediaItem = {
  id: string;
  postId: string;
  mediaId: string;
  order: number;
  isFreePreview: boolean;

  // Relations
  post: Post;
  media: Media;
};
```

## Standalone Entities

```typescript
type ContentSchedule = {
  id: string;
  channelId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time: string; // HH:MM format
  isActive: boolean;

  // Relations
  channel: Channel;
};
```
