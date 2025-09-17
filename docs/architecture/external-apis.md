# External APIs

This document outlines the external service integrations required for the FansLib Content Management Platform. The platform uses minimal external API integrations, focusing primarily on the Postpone API for Reddit optimization and RedGIFs URL discovery.

## Postpone API

- **Purpose:** Reddit subreddit analytics and RedGIFs URL discovery for content optimization
- **Documentation:** https://developers.postpone.app/
- **Base URL(s):** https://api.postpone.app/graphql
- **Authentication:** API key authentication via headers
- **Rate Limits:** To be determined based on API documentation

**Key Operations Used:**

### Subreddit Optimal Posting Times

- **Query:** `subredditAnalytics` - Retrieve optimal posting times for specific subreddits
- **Purpose:** Determine best posting windows to maximize engagement
- **Input:** Subreddit name, time range for analysis
- **Output:** Recommended posting times, engagement patterns, peak activity windows

### RedGIFs URL Discovery

- **Query:** `searchRedGIFs` - Find RedGIFs URLs for media files
- **Purpose:** Locate existing RedGIFs posts for media items to create cross-platform posts
- **Input:** Media filename, file hash, or content metadata
- **Output:** RedGIFs URL, post metadata, engagement statistics

**Integration Notes:**

- GraphQL API requires structured queries with proper error handling using Result types
- Implement caching for subreddit analytics to avoid repeated API calls
- RedGIFs URL discovery should be integrated into post composition workflow
- Handle cases where no RedGIFs URL is found for a media item
- All API operations must return `Result<T, PostponeApiError>` types
- Use ts-belt functional utilities for data transformation and error handling

## Error Handling Patterns

### API Error Types

```typescript
type PostponeApiError =
  | { type: "NetworkError"; message: string; correlationId: string }
  | { type: "AuthenticationError"; correlationId: string }
  | { type: "RateLimitError"; retryAfter: number; correlationId: string }
  | { type: "NotFoundError"; resource: string; correlationId: string }
  | { type: "GraphQLError"; errors: string[]; correlationId: string };
```

### Retry Logic

- **Network Errors:** Exponential backoff with jitter (1s, 2s, 4s, 8s max)
- **Rate Limits:** Respect `retryAfter` header, implement queue for pending requests
- **Authentication Errors:** Immediate failure, require manual intervention
- **GraphQL Errors:** Parse error details, map to appropriate business errors

### Caching Strategy

- **Subreddit Analytics:** Cache for 24 hours, refresh during off-peak hours
- **RedGIFs URLs:** Cache permanently once found, invalidate only on manual request
- **Failed Lookups:** Cache negative results for 1 hour to avoid repeated API calls

This minimal external API integration strategy ensures reliable operation while maintaining functional programming principles and comprehensive error handling.
