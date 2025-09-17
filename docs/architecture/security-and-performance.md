# Security and Performance

## Security Requirements

**Security Context:** Personal use application on private network with sensitive adult content

**Frontend Security:**

- **CSP Headers:** `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'`
- **XSS Prevention:** Input sanitization via DOMPurify, React's built-in XSS protection
- **Secure Storage:** No sensitive data in localStorage, session-only state management

**Backend Security:**

- **Input Validation:** Zod schema validation for all API endpoints

**Content Security:**

- **File Access Control:** Read-only media directory mounting
- **Path Traversal Prevention:** Validated file paths, no directory traversal
- **Content Isolation:** Thumbnails stored separately from original media

**Network Security:**

- **Private Network Only:** No external access required
- **Container Isolation:** Non-root user in Docker containers
- **Database Security:** PostgreSQL with limited user permissions

## Performance Optimization

**Philosophy:** No premature optimization - focus on correct implementation first, then optimize based on actual performance measurements and user feedback.

**Frontend Performance:**

- **Bundle Size Target:** < 500KB initial bundle (gzipped)
- **Loading Strategy:** Code splitting by route, lazy loading for media components
- **Caching Strategy:** ElectricSQL client-side caching, React Query for API responses

**Backend Performance:**

- **Response Time Target:** < 200ms for API responses
- **Database Optimization:** Strategic indexing on frequently queried columns
- **Caching Strategy:** In-memory caching for metadata, thumbnail generation queue

**Media Handling Optimization:**

- **Thumbnail Generation:** Background processing with Sharp/FFmpeg
- **File System Performance:** Direct file access, no upload/download overhead
- **Memory Management:** Streaming for large file operations

**Real-time Performance:**

- **ElectricSQL Sync:** Optimized shape subscriptions, minimal data transfer
- **WebSocket Efficiency:** Connection pooling, automatic reconnection
- **UI Responsiveness:** Optimistic updates, skeleton loading states
