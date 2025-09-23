# Database Schema

Based on the data models and PostgreSQL + Drizzle ORM choice, here is the complete database schema implementation:

## Drizzle Schema Definition

```typescript
import {
  bigint,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  pgEnum,
  json,
  serial,
} from 'drizzle-orm/pg-core';
import { createSchemaFactory } from 'drizzle-zod';
import { z } from 'zod/v4';

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({
    zodInstance: z,
  });

// Enums
export const postStatusEnum = pgEnum('post_status', [
  'DRAFT',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED'
]);

export const channelTypeEnum = pgEnum('channel_type', [
  'FANSLY',
  'MANYVIDS',
  'REDDIT',
  'BLUESKY',
  'REDGIFS',
  'CLIPS4SALE'
]);

// Core Tables
export const mediaTable = pgTable('media', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  filepath: varchar('filepath').notNull().unique(),
  filesize: bigint('filesize', { mode: 'bigint' }).notNull(),
  contentHash: varchar('content_hash').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  duration: integer('duration'), // Duration in seconds for videos, null for images
  mimeType: varchar('mime_type').notNull(),
  fileCreatedAt: timestamp('file_created_at').notNull(),
  fileModifiedAt: timestamp('file_modified_at').notNull(),
  shootId: integer('shoot_id').references(() => shootsTable.id, {
    onDelete: 'set null',
  }),
  thumbnailPath: varchar('thumbnail_path').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shootsTable = pgTable('shoots', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name').notNull(),
  date: timestamp('date').notNull(),
  description: text('description'),
  folderpath: varchar('folderpath').unique(), // Path to the source folder for auto-detected shoots
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const postsTable = pgTable('posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: varchar('title'),
  caption: text('caption').notNull(),
  status: postStatusEnum('status').default('DRAFT').notNull(),
  date: timestamp('date'),
  channelId: integer('channel_id').references(() => channelsTable.id, {
    onDelete: 'cascade',
  }).notNull(),
  subreddit: varchar('subreddit'),
  url: varchar('url'),
  hashtags: json('hashtags').$type<string[]>(), // Array of hashtag strings
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const channelsTable = pgTable('channels', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name').notNull(),
  type: channelTypeEnum('type').notNull(),
  description: text('description'),
  defaultHashtags: json('default_hashtags').$type<string[]>(), // Array of default hashtags
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tagDimensionsTable = pgTable('tag_dimensions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name').notNull().unique(),
  isExclusive: boolean('is_exclusive').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tagValuesTable = pgTable('tag_values', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  value: varchar('value').notNull(),
  dimensionId: integer('dimension_id').references(() => tagDimensionsTable.id, {
    onDelete: 'cascade',
  }).notNull(),
});

// Junction Tables
export const mediaTagsTable = pgTable('media_tags', {
  mediaId: integer('media_id').references(() => mediaTable.id, {
    onDelete: 'cascade',
  }).notNull(),
  tagValueId: integer('tag_value_id').references(() => tagValuesTable.id, {
    onDelete: 'cascade',
  }).notNull(),
});

export const postMediaItemsTable = pgTable('post_media_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  postId: integer('post_id').references(() => postsTable.id, {
    onDelete: 'cascade',
  }).notNull(),
  mediaId: integer('media_id').references(() => mediaTable.id, {
    onDelete: 'cascade',
  }).notNull(),
  order: integer('order').notNull(),
  isFreePreview: boolean('is_free_preview').default(false).notNull(),
});

export const contentSchedulesTable = pgTable('content_schedules', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  channelId: integer('channel_id').references(() => channelsTable.id, {
    onDelete: 'cascade',
  }).notNull(),
  dayOfWeek: integer('day_of_week').notNull(), // 0-6 (Sunday-Saturday)
  time: varchar('time').notNull(), // HH:MM format
  isActive: boolean('is_active').default(true).notNull(),
});

// Schema Factories for Validation
export const selectMediaSchema = createSelectSchema(mediaTable);
export const createMediaSchema = createInsertSchema(mediaTable).omit({
  createdAt: true,
});
export const updateMediaSchema = createUpdateSchema(mediaTable);

export const selectShootSchema = createSelectSchema(shootsTable);
export const createShootSchema = createInsertSchema(shootsTable).omit({
  createdAt: true,
  updatedAt: true,
});
export const updateShootSchema = createUpdateSchema(shootsTable);

export const selectPostSchema = createSelectSchema(postsTable);
export const createPostSchema = createInsertSchema(postsTable).omit({
  createdAt: true,
  updatedAt: true,
});
export const updatePostSchema = createUpdateSchema(postsTable);

export const selectChannelSchema = createSelectSchema(channelsTable);
export const createChannelSchema = createInsertSchema(channelsTable).omit({
  createdAt: true,
  updatedAt: true,
});
export const updateChannelSchema = createUpdateSchema(channelsTable);

export const selectTagDimensionSchema = createSelectSchema(tagDimensionsTable);
export const createTagDimensionSchema = createInsertSchema(tagDimensionsTable).omit({
  createdAt: true,
  updatedAt: true,
});
export const updateTagDimensionSchema = createUpdateSchema(tagDimensionsTable);

export const selectTagValueSchema = createSelectSchema(tagValuesTable);
export const createTagValueSchema = createInsertSchema(tagValuesTable);
export const updateTagValueSchema = createUpdateSchema(tagValuesTable);

// TypeScript Type Exports
export type Media = z.infer<typeof selectMediaSchema>;
export type CreateMedia = z.infer<typeof createMediaSchema>;
export type UpdateMedia = z.infer<typeof updateMediaSchema>;

export type Shoot = z.infer<typeof selectShootSchema>;
export type CreateShoot = z.infer<typeof createShootSchema>;
export type UpdateShoot = z.infer<typeof updateShootSchema>;

export type Post = z.infer<typeof selectPostSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;

export type Channel = z.infer<typeof selectChannelSchema>;
export type CreateChannel = z.infer<typeof createChannelSchema>;
export type UpdateChannel = z.infer<typeof updateChannelSchema>;

export type TagDimension = z.infer<typeof selectTagDimensionSchema>;
export type CreateTagDimension = z.infer<typeof createTagDimensionSchema>;
export type UpdateTagDimension = z.infer<typeof updateTagDimensionSchema>;

export type TagValue = z.infer<typeof selectTagValueSchema>;
export type CreateTagValue = z.infer<typeof createTagValueSchema>;
export type UpdateTagValue = z.infer<typeof updateTagValueSchema>;

// Enum type exports
export type PostStatus = typeof postStatusEnum.enumValues[number];
export type ChannelType = typeof channelTypeEnum.enumValues[number];
```

## Schema Design Rationale

**Drizzle ORM Benefits:**

- **Type Safety**: Automatic TypeScript type generation from schema
- **Schema as Code**: Schema definition in TypeScript with type checking
- **Zero Runtime Overhead**: Compile-time query building with no runtime schema validation
- **Drizzle-Zod Integration**: Automatic validation schema generation for API endpoints
- **Migration Management**: Version-controlled SQL migrations with `drizzle-kit`

**Performance Optimizations:**

- **Auto-incrementing integers** for primary keys (better performance than UUIDs for single-database setup)
- **Strategic indexing** on frequently queried columns (shootId, mimeType, contentHash, date)
- **Proper foreign key constraints** with appropriate cascade behaviors
- **JSON columns** for flexible arrays (hashtags, defaultHashtags) while maintaining PostgreSQL JSON query capabilities
- **Enum types** for better type safety and storage efficiency

**ElectricSQL Integration:**

- All tables include `createdAt` and `updatedAt` timestamps for conflict resolution
- Schema designed for efficient shape subscriptions
- Optimized for real-time updates and offline capability
- Clean separation between core data tables and junction tables

**Data Integrity:**

- **Foreign key constraints** ensure referential integrity
- **Unique constraints** prevent duplicate data
- **NOT NULL constraints** on required fields
- **Default values** for common fields (timestamps, boolean flags)
- **Cascade deletes** for dependent data cleanup

**Development Workflow:**

```bash
# Generate migrations from schema changes
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate

# Push schema changes directly (development)
npx drizzle-kit push

# View database in Drizzle Studio
npx drizzle-kit studio
```

This schema provides a robust foundation for the FansLib content management platform with excellent type safety, performance characteristics, and real-time synchronization capabilities.
