import {
  bigint,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createSchemaFactory } from 'drizzle-zod';
import { z } from 'zod/v4';

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({
    zodInstance: z,
  });

export const mediaTable = pgTable('media', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  filepath: varchar('filepath').notNull().unique(),
  filesize: bigint('filesize', { mode: 'bigint' }).notNull(),
  contentHash: varchar('contentHash').notNull(),
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

export type Media = z.infer<typeof selectMediaSchema>;
export type UpdateMedia = z.infer<typeof updateMediaSchema>;
export type Shoot = z.infer<typeof selectShootSchema>;
export type UpdateShoot = z.infer<typeof updateShootSchema>;
