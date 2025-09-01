# Design Document

## Overview

This design transforms the Reddit Bulk Posting component from a local SQLite-based scheduling system to a server-based queue system. The implementation will replace the current `scheduleAllPosts` functionality with server API calls, add individual post scheduling capabilities, and integrate server job status monitoring into the existing UI.

## Architecture

### High-Level Flow

1. **Post Generation**: Remains unchanged - posts are generated locally with media selection and caption generation
2. **Scheduling**: Posts are sent directly to the server queue via API calls instead of local database storage
3. **Status Monitoring**: The scheduled posts list displays server queue jobs with real-time status updates
4. **Server Communication**: Utilizes existing server-communication feature for API calls

### Component Modifications

```
RedditBulkPostGenerator
├── PostGenerationGrid (modified)
│   ├── Individual "Schedule" buttons per post
│   └── Server status validation
├── Scheduling Controls (modified)
│   ├── "Schedule All" → server queue
│   └── Server connection indicator
└── ScheduledPostsList (modified)
    ├── Server queue jobs display
    ├── Real-time status updates
    └── Cancel/delete functionality
```

## Components and Interfaces

### 1. Enhanced PostGenerationGrid

**New Props:**

```typescript
type PostGenerationGridProps = {
  posts: GeneratedPost[];
  onUpdatePost: (index: number, updates: Partial<GeneratedPost>) => void;
  onRegenerateMedia: (index: number) => void;
  onScheduleIndividualPost: (postId: string) => Promise<void>; // NEW
  isServerAvailable: boolean; // NEW
  isSchedulingPost: string | null; // NEW - tracks which post is being scheduled by ID
};
```

**New Features:**

- Individual "Schedule" button per post card
- Server availability indicator per post
- Loading states for individual post scheduling
- Disabled states when server unavailable

### 2. Modified RedditBulkPostGenerator

**New State:**

```typescript
const [isServerAvailable, setIsServerAvailable] = useState(false);
const [schedulingPostId, setSchedulingPostId] = useState<string | null>(null);
const [serverConnectionError, setServerConnectionError] = useState<string | null>(null);
```

**New Methods:**

```typescript
const checkServerAvailability = async (): Promise<boolean>;
const scheduleIndividualPost = async (postId: string): Promise<void>;
const scheduleAllPostsToServer = async (): Promise<void>;
const handleServerError = (error: Error): void;
```

### 3. Enhanced ScheduledPostsList

**Modified to display:**

- Server queue jobs, no local posts (if any remain)
- Queue status badges (queued, processing, posted, failed)
- Error messages for failed jobs
- Cancel buttons for queued jobs
- Visual distinction between server and local posts

### 4. Server Communication Integration

**New API Calls:**

```typescript
// Unified post scheduling (handles both individual and batch)
const schedulePostsToServer = async (posts: GeneratedPost[]): Promise<QueueJobResponse[]>;

// Enhanced job monitoring
const getServerJobsWithStatus = async (): Promise<QueueJobResponse[]>;
```

## Data Models

### Enhanced GeneratedPost Type

```typescript
type GeneratedPost = {
  id: string; // NEW - unique identifier for each generated post
  subreddit: Subreddit;
  media: Media;
  caption: string;
  date: Date;
  serverJobId?: string; // NEW - tracks server job after scheduling
  schedulingStatus?: "idle" | "scheduling" | "scheduled" | "failed"; // NEW
  schedulingError?: string; // NEW
};
```

### Server Job Mapping

```typescript
type ServerScheduledPost = ScheduledPost & {
  serverJobId: string;
  queueStatus: QueueStatus;
  errorMessage?: string;
  canCancel: boolean;
};
```

## Error Handling

### Server Availability Checks

1. **Initial Load**: Check server availability on component mount
2. **Periodic Checks**: Poll server status every 30 seconds
3. **Error Recovery**: Retry failed connections with exponential backoff
4. **User Feedback**: Clear indicators when server is unavailable

### Scheduling Error Handling

1. **Individual Post Failures**: Show error toast, keep post in grid
2. **Batch Failures**: Show summary of failed posts, remove successful ones
3. **Network Errors**: Distinguish between server errors and network issues
4. **Validation Errors**: Handle server-side validation failures

### Error States

```typescript
type SchedulingError = {
  type: "server_unavailable" | "validation_error" | "network_error" | "unknown_error";
  message: string;
  retryable: boolean;
  postId?: string; // For individual post errors
};
```

## Testing Strategy

### Unit Tests

1. **Server Communication**: Mock API calls and test error handling
2. **State Management**: Test scheduling state transitions
3. **Error Handling**: Test various error scenarios and recovery
4. **UI Components**: Test button states and loading indicators

### Integration Tests

1. **End-to-End Scheduling**: Test complete flow from generation to server queue
2. **Server Connectivity**: Test behavior with server online/offline
3. **Real-time Updates**: Test job status synchronization
4. **Error Recovery**: Test retry mechanisms and user feedback

### Manual Testing Scenarios

1. **Server Offline**: Verify graceful degradation when server unavailable
2. **Partial Failures**: Test mixed success/failure in batch scheduling
3. **Network Interruption**: Test behavior during network issues
4. **Job Cancellation**: Test canceling queued jobs from UI

## Implementation Notes

### Backward Compatibility

- Remove local scheduling functionality entirely (for reddit posts) as per requirements
- No migration needed
- Update database schema to remove local post scheduling tables (future cleanup)

### Performance Considerations

- Batch API calls for multiple post scheduling
- Use optimistic UI updates with rollback on failure
- Cache server availability status to reduce API calls

### Security Considerations

- Validate all post data before sending to server
- Sanitize error messages displayed to users

### UI/UX Enhancements

- Clear visual feedback for server connection status
- Progress indicators for batch operations
- Contextual help text explaining server-based scheduling
