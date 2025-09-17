# Error Handling Strategy

This document defines the comprehensive error handling approach for the FansLib Content Management Platform, ensuring consistent error management across frontend and backend systems.

## General Approach

- **Error Model:** Result types from ts-belt (`Result<T, E>`) with structured error discriminated unions containing correlation IDs, error codes, and contextual information
- **Error Type System:** Domain-specific error types as discriminated unions, never throw exceptions or use Error classes
- **Error Propagation:** Functional composition using Result.map, Result.flatMap, and Result.mapError for graceful error handling

## Logging Standards

- **Library:** Built-in Bun logging with structured JSON format for backend, browser console with correlation IDs for frontend
- **Format:** JSON structured logs with timestamp, level, correlation ID, service context, and error details
- **Levels:** ERROR (system failures), WARN (recoverable issues), INFO (business events), DEBUG (development only)
- **Required Context:**
  - Correlation ID: `UUID v4 format (req-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)`
  - Service Context: `service name, version, environment`
  - User Context: `session ID only (no PII as this is single-user system)`

## Error Handling Patterns

### External API Errors

**Retry Policy:** Exponential backoff with jitter (1s, 2s, 4s, 8s max) for transient failures, immediate failure for 4xx client errors

**Circuit Breaker:** Open circuit after 5 consecutive failures, half-open after 30 seconds, close after 3 successful requests

**Timeout Configuration:**

- Content platform APIs: 30 seconds
- File system operations: 10 seconds
- Database operations: 5 seconds

**Error Translation:** Map platform-specific errors to standardized internal error codes with user-friendly messages

### Business Logic Errors

**Error Types (Discriminated Unions):**

```typescript
type AppError =
  | { type: "ContentNotFound"; mediaId: string; correlationId: string }
  | {
      type: "DuplicatePost";
      postId: string;
      platform: string;
      correlationId: string;
    }
  | {
      type: "InvalidSchedule";
      reason: string;
      timestamp: Date;
      correlationId: string;
    }
  | {
      type: "TagDimension";
      dimensionId: string;
      value: string;
      correlationId: string;
    }
  | {
      type: "FileSystem";
      path: string;
      operation: string;
      correlationId: string;
    }
  | {
      type: "Validation";
      field: string;
      message: string;
      correlationId: string;
    };
```

**User-Facing Errors:** Clear, actionable messages without technical jargon, with suggested resolution steps

**Error Codes:** Hierarchical system (CONTENT_001, SCHEDULE_002, etc.) for categorization and tracking

### Data Consistency

**Transaction Strategy:** Use Prisma transactions returning `Result<T, TransactionError>` for multi-table operations, ElectricSQL optimistic updates with conflict resolution

**Compensation Logic:** Implement saga pattern for complex workflows (content import, batch scheduling) using Result composition for rollback capabilities

**Idempotency:** All mutations must be idempotent with operation keys, returning `Result<T, IdempotencyError>` for duplicate operations

## Frontend Error Handling

### React Error Boundaries

```typescript
// Component-level error boundaries for each major feature area
// These handle exceptions from third-party libraries that don't use Result types
- ContentBrowserErrorBoundary (media scanning, display failures)
- PostCompositionErrorBoundary (form validation, save failures)
- SchedulingErrorBoundary (calendar operations, batch scheduling)
- TaggingErrorBoundary (tag operations, dimension management)

// All application logic should use Result types and handle errors functionally
```

### State Management Errors

**TanStack Query:** Functions return `Result<T, E>`, automatic retry with exponential backoff, error state management using Result types

**ElectricSQL Sync:** Handle sync failures using Result composition, queue mutations returning `Result<T, SyncError>` for retry

**Jotai State:** Error atoms store Result types for component-level error state, reset mechanisms for error recovery

### User Experience

**Loading States:** Skeleton screens for content loading, progress indicators for batch operations

**Error Messages:** Toast notifications for transient errors, inline validation for forms, modal dialogs for critical failures

**Sync Handling:** ElectricSQL is always available - focus on conflict resolution and optimistic updates

## Backend Error Handling

### Elysia.js Middleware

**Global Error Handler:** Catch all unhandled exceptions, log with correlation ID, return sanitized error responses

**Validation Middleware:** Zod schema validation with detailed field-level error messages

**Request Logging:** Log all requests with correlation ID, duration, and outcome

### Database Error Handling

**Prisma Errors:** Map database constraints to business errors, handle connection failures with retry logic

**ElectricSQL Proxy:** Handle schema migrations gracefully, maintain sync consistency

### File System Operations

**Content Scanning:** Robust error handling for corrupted files, permission issues, network drive failures

**Media Processing:** Validate file types, handle corrupted media gracefully, provide fallback thumbnails

**Watch Service:** Restart file watchers on failure, handle rapid file system changes without overwhelming the system

## Result Type Patterns

### Function Signatures

All functions that can fail must return `Result<T, E>` types:

```typescript
import { Result, Ok, Error } from "ts-belt";

// Good: Returns Result type
const scanContentLibrary = (
  path: string
): Result<MediaItem[], FileSystemError> => {
  // Implementation using Result.map, Result.flatMap
};

// Bad: Throws exceptions
const scanContentLibrary = (path: string): MediaItem[] => {
  throw new Error("File not found"); // Never do this
};
```

### Error Composition

Use Result composition for complex operations:

```typescript
import { pipe } from "ts-belt";

const processContent = (mediaId: string): Result<ProcessedMedia, AppError> =>
  pipe(
    findMediaById(mediaId),
    Result.flatMap(validateMedia),
    Result.flatMap(processMediaFile),
    Result.flatMap(saveProcessedMedia)
  );
```

### Error Pattern Matching

Handle errors using pattern matching:

```typescript
const handleResult = (result: Result<MediaItem, AppError>) => {
  if (Result.isOk(result)) {
    // Handle success case
    const mediaItem = result.value;
  } else {
    // Handle error cases
    const error = result.error;
    switch (error.type) {
      case "ContentNotFound":
        showNotFoundMessage(error.mediaId);
        break;
      case "FileSystem":
        showFileSystemError(error.path, error.operation);
        break;
      // ... other error cases
    }
  }
};
```

This error handling strategy ensures robust operation of the FansLib platform with comprehensive error recovery, detailed logging for debugging, and excellent user experience even when failures occur, all while maintaining functional programming principles.
