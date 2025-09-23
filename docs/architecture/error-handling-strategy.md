# Error Handling Strategy

This document defines a simplified error handling approach for the FansLib Content Management Platform using Result types for consistent error management.

## General Approach

- **Error Model:** Result types from ts-belt (`Result<T, E>`) for all operations that can fail
- **Error Propagation:** Functional composition using `Result.map`, `Result.flatMap`, and `Result.mapError`
- **No Exceptions:** Never throw exceptions or use Error classes - always return Result types

## Result Type Patterns

### Function Signatures

All functions that can fail must return `Result<T, E>` types:

```typescript
import { Result, Ok, Error } from "ts-belt";

// Good: Returns Result type
const scanContentLibrary = (
  path: string
): Result<MediaItem[], string> => {
  try {
    const items = performScan(path);
    return Ok(items);
  } catch (err) {
    return Error(`Failed to scan path: ${path}`);
  }
};

// Bad: Throws exceptions
const scanContentLibrary = (path: string): MediaItem[] => {
  throw new Error("File not found"); // Never do this
};
```

### Error Composition

Use Result composition for complex operations:

```typescript
import { R, pipe } from "ts-belt";

const processContent = (mediaId: string): Result<ProcessedMedia, string> =>
  pipe(
    findMediaById(mediaId),
    R.flatMap(validateMedia),
    R.flatMap(processMediaFile),
    R.flatMap(saveProcessedMedia)
  );
```

### Error Pattern Matching

Handle errors using simple pattern matching:

```typescript
const handleResult = (result: Result<MediaItem, string>) => {
  R.match(result,
    (successResult) => {
      console.log('Success:', successResult);
    },
    (error) => {
      console.error('Error:', error);
    }
  )
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
const createMediaRecord = async (
  db: Database,
  data: CreateMedia
): Promise<Result<Media, string>> => {
  try {
    const [newItem] = await db
      .insert(mediaTable)
      .values(data)
      .returning();

    return Ok(newItem);
  } catch (error) {
    return Error(`Database error: ${error.message}`);
  }
};
```

### File System Operations

```typescript
const scanDirectory = async (path: string): Promise<Result<string[], string>> => {
  try {
    const files = await readdir(path);
    return Ok(files);
  } catch (error) {
    return Error(`Cannot read directory: ${path}`);
  }
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
const withRetry = async <T>(
  operation: () => Promise<Result<T, string>>,
  maxAttempts: number = 3
): Promise<Result<T, string>> => {
  const attempts = Array.from({ length: maxAttempts }, (_, i) => i + 1);

  for (const attempt of attempts) {
    const result = await operation();

    if (Result.isOk(result) || attempt === maxAttempts) {
      return result;
    }

    // Simple delay between retries
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  }

  return Error('Max retry attempts exceeded');
};
```

## Key Principles

1. **Always Return Results**: Every operation that can fail returns `Result<T, E>`
2. **Compose Functionally**: Use `pipe`, `Result.map`, and `Result.flatMap` for error propagation
3. **Simple Error Messages**: Use plain strings for error descriptions
4. **Handle at Boundaries**: Convert Results to appropriate responses at API/UI boundaries
5. **No Silent Failures**: Always handle both success and error cases explicitly

This simplified approach ensures consistent error handling while maintaining code readability and functional programming principles without the complexity of extensive logging, retry logic, or error classification systems.
