# Security and Performance

## Security Requirements

**Security Context:** Personal use application on private network with sensitive adult content

**Frontend Security:**

- **Secure Storage:** No sensitive data in localStorage, session-only state management

**Backend Security:**

- **Input Validation:** Zod schema validation

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

- **Loading and Caching Strategy:** Handled by Tanstack Router

**Backend Performance:**

- **Caching Strategy:** In-memory caching for metadata, thumbnail generation queue

**Media Handling Optimization:**

- **Thumbnail Generation:** Background processing with Sharp/FFmpeg
- **File System Performance:** Direct file access, no upload/download overhead
- **Memory Management:** Streaming for large file operations

**Real-time Performance:**

- **ElectricSQL Sync:** Broad shape subscriptions favoring ease of use before optimization
- **UI Responsiveness:** Optimistic updates, no loading states as it's local-first
