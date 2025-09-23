# API Specification

Based on the chosen hybrid API approach (tRPC for mutations + TanStack DB live queries for real-time data sync), FansLib uses a **dual-channel architecture**:

1. **TanStack DB Collections with ElectricSQL** - Real-time data synchronization for queries and live updates
2. **tRPC Endpoints** - Type-safe server-authoritative mutations with automatic transaction handling

## TanStack DB Live Query Configuration

TanStack DB Collections handle all **read operations** and **real-time synchronization** through ElectricSQL shape subscriptions. The TanStack Start server acts as an ElectricSQL proxy with authentication and filtering.

### Media Collection

```typescript
// Electric proxy endpoint: GET /api/media
const mediaCollection = createCollection(
  electricCollectionOptions({
    id: 'media',
    shapeOptions: {
      url: '/api/media',
      parser: {
        timestamptz: (date: string) => new Date(date),
      },
    },
    schema: selectMediaSchema,
    getKey: (item) => item.id,
    // Mutations handled via tRPC
    onUpdate: async ({ transaction }) => {
      const { modified: updatedMedia } = transaction.mutations[0];
      const result = await trpc.media.update.mutate({
        id: updatedMedia.id,
        data: updatedMedia,
      });
      return { txid: result.txid };
    },
    onDelete: async ({ transaction }) => {
      const { original: deletedMedia } = transaction.mutations[0];
      const result = await trpc.media.delete.mutate({
        id: deletedMedia.id,
      });
      return { txid: result.txid };
    },
  })
);
```

### Shoots Collection

```typescript
// Electric proxy endpoint: GET /api/shoots
const shootCollection = createCollection(
  electricCollectionOptions({
    id: 'shoots',
    shapeOptions: {
      url: '/api/shoots',
      parser: {
        timestamptz: (date: string) => new Date(date),
      },
    },
    schema: selectShootSchema,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const { modified: newShoot } = transaction.mutations[0];
      const result = await trpc.shoots.create.mutate(newShoot);
      return { txid: result.txid };
    },
    onUpdate: async ({ transaction }) => {
      const { modified: updatedShoot } = transaction.mutations[0];
      const result = await trpc.shoots.update.mutate({
        id: updatedShoot.id,
        data: omit(updatedShoot, ['id']),
      });
      return { txid: result.txid };
    },
    onDelete: async ({ transaction }) => {
      const { original: deletedShoot } = transaction.mutations[0];
      const result = await trpc.shoots.delete.mutate({
        id: deletedShoot.id,
      });
      return { txid: result.txid };
    },
  })
);
```

## tRPC API Endpoints (Mutations)

All **write operations** go through tRPC endpoints to ensure type safety, server authority, and proper validation. These endpoints return transaction IDs for ElectricSQL sync confirmation.

### Media Management Router

```typescript
// /api/trpc/media.*
export const mediaRouter = router({
  // Create new media record
  create: procedure
    .input(createMediaSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [newItem] = await tx.insert(mediaTable).values(input).returning();
        return { item: newItem, txid };
      });
      return result;
    }),

  // Update existing media
  update: procedure
    .input(z.object({
      id: z.number(),
      data: updateMediaSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [updatedItem] = await tx
          .update(mediaTable)
          .set(input.data)
          .where(eq(mediaTable.id, input.id))
          .returning();

        if (!updatedItem) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Media not found',
          });
        }

        return { item: updatedItem, txid };
      });
      return result;
    }),

  // Delete media record
  delete: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [deletedItem] = await tx
          .delete(mediaTable)
          .where(eq(mediaTable.id, input.id))
          .returning();

        if (!deletedItem) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Media not found',
          });
        }

        return { item: deletedItem, txid };
      });
      return result;
    }),
});
```

### Shoots Management Router

```typescript
// /api/trpc/shoots.*
export const shootsRouter = router({
  // Create new shoot
  create: procedure
    .input(createShootSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [newItem] = await tx
          .insert(shootsTable)
          .values(input)
          .returning();
        return { item: newItem, txid };
      });
      return result;
    }),

  // Update existing shoot
  update: procedure
    .input(z.object({
      id: z.number(),
      data: updateShootSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [updatedItem] = await tx
          .update(shootsTable)
          .set(input.data)
          .where(eq(shootsTable.id, input.id))
          .returning();

        if (!updatedItem) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Shoot not found',
          });
        }

        return { item: updatedItem, txid };
      });
      return result;
    }),

  // Delete shoot
  delete: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [deletedItem] = await tx
          .delete(shootsTable)
          .where(eq(shootsTable.id, input.id))
          .returning();

        if (!deletedItem) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Shoot not found',
          });
        }

        return { item: deletedItem, txid };
      });
      return result;
    }),
});
```

## Type Safety & Schema Validation

The system leverages **Drizzle-Zod** integration for automatic schema generation and validation:

```typescript
// Auto-generated from Drizzle schema
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

// Inferred TypeScript types
export type Media = z.infer<typeof selectMediaSchema>;
export type UpdateMedia = z.infer<typeof updateMediaSchema>;
export type Shoot = z.infer<typeof selectShootSchema>;
export type UpdateShoot = z.infer<typeof updateShootSchema>;
```

## Database Schema

Current tables managed by the system:

### Media Table
```typescript
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
```

### Shoots Table
```typescript
export const shootsTable = pgTable('shoots', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name').notNull(),
  date: timestamp('date').notNull(),
  description: text('description'),
  folderpath: varchar('folderpath').unique(), // Path to the source folder for auto-detected shoots
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## Client Usage Examples

### Frontend Collection Integration

```typescript
import { mediaCollection, shootCollection } from '~/lib/collections';
import { trpc } from '~/lib/trpc/client';

// Reading data (automatically synced via ElectricSQL)
const MediaGallery = () => {
  const { data: mediaItems, isLoading, isError, status } = useLiveQuery((q) =>
    q.from({ media: mediaCollection })
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading media</div>;
  
  return (
    <div>
      {mediaItems?.map(item => (
        <img key={item.id} src={item.thumbnailPath} />
      ))}
    </div>
  );
};

// Mutations via tRPC (with optimistic updates)
const CreateShootForm = () => {
  const handleSubmit = async (formData) => {
    // Optimistic update via collection
    shootCollection.insertItem({
      id: tempId,
      ...formData,
    });
    
    // Server mutation will sync back with proper ID and txid
  };
};
```

### Direct tRPC Usage

```typescript
// For operations not handled by collections
const useMediaOperations = () => {
  const createMediaMutation = trpc.media.create.useMutation();
  const updateMediaMutation = trpc.media.update.useMutation();
  const deleteMediaMutation = trpc.media.delete.useMutation();
  
  return {
    createMedia: createMediaMutation.mutate,
    updateMedia: updateMediaMutation.mutate,
    deleteMedia: deleteMediaMutation.mutate,
  };
};
```

## Architecture Benefits

**Type Safety:**
- End-to-end type safety from database to frontend
- Automatic schema validation via Drizzle-Zod
- tRPC ensures API contract consistency

**Real-time Synchronization:**
- File system changes instantly appear in UI via ElectricSQL
- Multi-device synchronization without complex state management
- Optimistic updates with automatic rollback on conflicts

**Developer Experience:**
- Auto-completion for all API calls
- Compile-time error checking
- Automatic code generation from schema changes

**Performance:**
- No traditional API queries for reads - data flows directly from PostgreSQL
- Efficient change detection via ElectricSQL shapes
- Local-first experience with TanStack DB caching
- Automatic request deduplication and caching via tRPC

**Server Authority:**
- All mutations validated and processed server-side
- Transaction IDs ensure proper sync confirmation
- Proper error handling with typed responses