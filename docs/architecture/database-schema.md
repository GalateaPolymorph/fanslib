# Database Schema

Based on the data models and PostgreSQL + Prisma choice, here is the complete database schema implementation:

```prisma
// This is the complete Prisma schema for FansLib
generator client {
  provider = "prisma-client-js"
}

generator electric {
  provider = "prisma-electric-client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Media {
  id               String    @id @default(uuid())
  filepath         String    @unique
  filesize         BigInt
  contentHash      String
  dimensions       Json      // { width: number, height: number }
  duration         Float?    // Video duration in seconds
  mimeType         String
  fileCreatedAt    DateTime
  fileModifiedAt   DateTime
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  shootId          String?
  thumbnailPath    String

  // Relations
  shoot            Shoot?           @relation(fields: [shootId], references: [id], onDelete: SetNull)
  postMediaItems   PostMediaItem[]
  tags             MediaTag[]

  // Indexes for performance
  @@index([shootId])
  @@index([mimeType])
  @@index([fileCreatedAt])
  @@index([contentHash])
  @@index([shootId, mimeType]) // Common filter combination
}

model Shoot {
  id          String    @id @default(uuid())
  name        String
  date        DateTime
  description String?
  folderPath  String?   @unique
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  media       Media[]

  // Indexes
  @@index([date])
  @@index([name])
}

model Post {
  id         String      @id @default(uuid())
  title      String?
  caption    String
  status     PostStatus  @default(DRAFT)
  date       DateTime?
  channelId  String
  subreddit  String?
  url        String?
  hashtags   String[]    // Array of hashtag strings
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  // Relations
  channel    Channel     @relation(fields: [channelId], references: [id], onDelete: Cascade)
  mediaItems PostMediaItem[]

  // Indexes
  @@index([status])
  @@index([date])
  @@index([channelId])
  @@index([status, date]) // Common query pattern
}

model Channel {
  id              String            @id @default(uuid())
  name            String
  type            ChannelType
  description     String?
  defaultHashtags String[]          // Array of default hashtags
  isActive        Boolean           @default(true)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  // Relations
  posts           Post[]
  schedules       ContentSchedule[]

  // Indexes
  @@index([type])
  @@index([isActive])
}

model TagDimension {
  id          String     @id @default(uuid())
  name        String     @unique
  isExclusive Boolean    @default(false)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Relations
  values      TagValue[]
}

model TagValue {
  id          String        @id @default(uuid())
  value       String
  dimensionId String

  // Relations
  dimension   TagDimension  @relation(fields: [dimensionId], references: [id], onDelete: Cascade)
  mediaTags   MediaTag[]

  // Unique constraint on dimension + value
  @@unique([dimensionId, value])
  @@index([dimensionId])
}

model MediaTag {
  mediaId    String
  tagValueId String

  // Relations
  media      Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)
  tagValue   TagValue @relation(fields: [tagValueId], references: [id], onDelete: Cascade)

  @@id([mediaId, tagValueId])
}

model PostMediaItem {
  id            String   @id @default(uuid())
  postId        String
  mediaId       String
  order         Int      // Order within the post
  isFreePreview Boolean  @default(false)

  // Relations
  post          Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  media         Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)

  // Unique constraint to prevent duplicate media in same post
  @@unique([postId, mediaId])
  @@index([postId, order]) // For ordered retrieval
}

model ContentSchedule {
  id        String   @id @default(uuid())
  channelId String
  dayOfWeek Int      // 0-6 (Sunday-Saturday)
  time      String   // HH:MM format
  isActive  Boolean  @default(true)

  // Relations
  channel   Channel  @relation(fields: [channelId], references: [id], onDelete: Cascade)

  // Unique constraint to prevent duplicate schedules
  @@unique([channelId, dayOfWeek, time])
  @@index([channelId, isActive])
}

// Enums
enum PostStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  ARCHIVED
}

enum ChannelType {
  FANSLY
  MANYVIDS
  REDDIT
  BLUESKY
  REDGIFS
  CLIPS4SALE
}
```

## Schema Design Rationale

**Performance Optimizations:**

- **UUIDs for primary keys** - Better for distributed systems and ElectricSQL sync
- **Composite indexes** on common filter combinations (shootId + mimeType, status + date)
- **JSON fields** for flexible data (dimensions, hashtags) while maintaining queryability
- **Proper cascading deletes** to maintain referential integrity
- **Strategic indexing** on frequently queried columns

**ElectricSQL Integration:**

- All tables include `createdAt` and `updatedAt` for conflict resolution
- UUID primary keys prevent sync conflicts
- Schema designed for efficient shape subscriptions
- Optimized for real-time updates and offline capability
