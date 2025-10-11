# Error Handling Strategy

This document defines a simplified error handling approach for the FansLib Content Management Platform using Effect types for consistent error management.

## General Approach

- **Error Model:** Effect types from Effect.ts (`Effect<A, E, R>`) for all operations that can fail
- **Error Propagation:** Functional composition using `Effect.map`, `Effect.flatMap`, and `Effect.mapError`
- **No Exceptions:** Never throw exceptions or use Error classes - always return Effect types

## Effect Type Patterns

### Function Signatures

All functions that can fail must return `Effect<A, E, R>` types:

```typescript
import { Effect } from "effect";

// Good: Returns Effect type
class ScanError extends Data.TaggedError("ScanError")<{}> {}

const scanContentLibrary = (
  path: string
): Effect.Effect<MediaItem[], string> => {
  return Effect.tryPromise({
    try: () => performScan(path),
    catch: () => new ScanError(),
  });
};

// Bad: Throws exceptions
const scanContentLibrary = (path: string): MediaItem[] => {
  throw new Error("File not found"); // Never do this
};
```

### Error Composition

Use Effect composition for complex operations:

```typescript
import { Effect, pipe } from "effect";

const processContent = (mediaId: string) =>
  pipe(
    findMediaById(mediaId),
    Effect.flatMap(validateMedia),
    Effect.flatMap(processMediaFile),
    Effect.flatMap(saveProcessedMedia)
  );
```

### Error Pattern Matching

Handle errors using Effect pattern matching:

```typescript
import { Effect, Exit } from "effect";

const handleResult = (effect: Effect.Effect<MediaItem, string>) => {
  Effect.runPromiseExit(effect).then((exit) => {
    Exit.match(exit, {
      onSuccess: (result) => console.log('Success:', result),
      onFailure: (cause) => console.error('Error:', cause),
    });
  });
};
```

## Frontend Error Handling

### Component Level

```typescript
const MediaGallery = () => {
  const { data: mediaItems, isLoading, isError, error } = useLiveQuery((q) =>
    q.from({ media: mediaCollection })
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading media: {error?.message}</div>;

  return (
    <div>
      {mediaItems?.map(item => (
        <img key={item.id} src={item.thumbnailPath} />
      ))}
    </div>
  );
};
```

### tRPC Mutations

```typescript
const useMediaOperations = () => {
  const createMediaMutation = trpc.media.create.useMutation();

  const createMedia = async (data: CreateMedia) => {
    try {
      const result = await createMediaMutation.mutateAsync(data);
      return result.item;
    } catch (error) {
      // Error is automatically handled by tRPC
      console.error('Failed to create media:', error.message);
      throw error; // Re-throw to let UI handle it
    }
  };

  return {
    createMedia,
    isLoading: createMediaMutation.isPending,
    error: createMediaMutation.error,
  };
};
```

## Backend Error Handling

### tRPC Procedures

```typescript
export const mediaRouter = router({
  create: procedure
    .input(createMediaSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await pipe(
        validateMediaInput(input),
        Result.flatMap(data => createMediaRecord(ctx.db, data)),
        Result.map(item => ({ item, txid: generateTxId() }))
      );

      if (Result.isError(result)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: result.error,
        });
      }

      return result.value;
    }),
});
```

### Database Operations

```typescript
const createMediaRecord = (
  db: Database,
  data: CreateMedia
): Effect.Effect<Media, string> => {
  return Effect.tryPromise({
    try: async () => {
      const [newItem] = await db
        .insert(mediaTable)
        .values(data)
        .returning();
      return newItem;
    },
    catch: (error) => `Database error: ${error.message}`,
  });
};
```

### File System Operations

```typescript
class ScanError extends Data.TaggedError('ScanError')<{ path: string }> {
  constructor(path: string) {
    super({ path });
  }
}

const scanDirectory = (path: string): Effect.Effect<string[], ScanError> => {
  return Effect.tryPromise({
    try: () => readdir(path),
    catch: (error) => new ScanError(path),
  });
};
```

## Integration with External Systems

### ElectricSQL Collections

```typescript
const mediaCollection = createCollection(
  electricCollectionOptions({
    id: 'media',
    // ... other options
    onUpdate: async ({ transaction }) => {
      try {
        const result = await trpc.media.update.mutate({
          id: transaction.mutations[0].modified.id,
          data: transaction.mutations[0].modified,
        });
        return { txid: result.txid };
      } catch (error) {
        // Let collection handle the error
        console.error('Update failed:', error.message);
        throw error; // Collection will handle retry/rollback
      }
    },
  })
);
```

## Error Recovery

Keep error recovery simple and predictable:

```typescript
const withRetry = <A, E>(
  effect: Effect.Effect<A, E>,
  maxAttempts: number = 3
): Effect.Effect<A, E> => {
  return Effect.retry(effect, {
    times: maxAttempts - 1,
    schedule: Schedule.exponential("1 seconds"),
  });
};
```

## Key Principles

1. **Always Return Effects**: Every operation that can fail returns `Effect<A, E, R>`
2. **Compose Functionally**: Use `pipe`, `Effect.map`, and `Effect.flatMap` for error propagation
3. **Simple Error Messages**: Use plain strings for error descriptions
4. **Handle at Boundaries**: Convert Effects to appropriate responses at API/UI boundaries using `Effect.runPromise`
5. **No Silent Failures**: Always handle both success and error cases explicitly

This simplified approach ensures consistent error handling while maintaining code readability and functional programming principles without the complexity of extensive logging, retry logic, or error classification systems.
