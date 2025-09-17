# Epic 2: Post Composition & Content Creation

**Expanded Goal**: Implement comprehensive post creation and management system that enables creators to efficiently compose posts with titles, captions, hashtags, and reusable text elements. This epic delivers the foundational content publishing workflow that bridges content organization with platform distribution.

## Story 2.1: Channel Management System

_As a content creator, I want to manage my channels with platform-specific configurations, so that I can organize my posting destinations and maintain platform-specific settings._

### Acceptance Criteria

1. Channel creation interface with name, channel type selection, and description
2. Channel type definitions supporting Fansly, ManyVids, Reddit, Bluesky, RedGIFs, and Clips4Sale
3. Channel editing and deletion functionality with confirmation
4. Channel listing view showing all configured channels grouped by type

## Story 2.2: Post Entity Data Model and Management

_As a content creator, I want to create post entities that can contain multiple media items with metadata, so that I can organize my content for publishing across different channels._

### Acceptance Criteria

1. Post entity data model supporting multiple media items per post with order/sequence management
2. Post metadata including title (optional), caption (required), posting date, channel assignment
3. Post status tracking (draft, scheduled, published, archived)
4. Free preview designation for one or more media items within each post
5. Channel assignment using channel concept (not platform assignment)
6. Channel types definition (Fansly, ManyVids, Reddit, RedGIFs, etc.) supporting multiple channels per type
7. Subreddit assignment field for posts assigned to Reddit channel types (text-only for MVP)
8. URL field for post entities to store URLs from published posts (e.g., RedGIFs URLs, Reddit post URLs, Fansly post URLs)
9. Post creation workflow from selected media items in content browser
10. Post editing interface for modifying content and metadata
11. Post deletion with confirmation and media item reassignment options
12. Post listing view showing all created posts with status indicators
13. Post search and filtering capabilities by status, date, and content

## Story 2.3: Caption Composition Interface

_As a content creator, I want a simple text interface for creating and editing post captions, so that I can craft engaging content descriptions._

### Acceptance Criteria

1. Multi-line text input for caption composition with character count
2. Auto-save functionality to prevent caption loss during composition
3. Caption validation for platform-specific character limits with visual indicators

## Story 2.4: Hashtag Parsing and Management

_As a content creator, I want the system to automatically detect and parse hashtags in my captions, so that I can track hashtag usage and prepare for future analytics._

### Acceptance Criteria

1. Automatic hashtag detection and parsing within caption text using # symbol
2. Visual highlighting of detected hashtags within caption interface
3. Hashtag extraction and storage for each post entity
4. Hashtag suggestion dropdown based on previously used hashtags
5. Hashtag count display and platform-specific limits warning

## Story 2.5: Default Hashtags System

_As a content creator, I want to configure default hashtags for each channel, so that I can quickly add consistent hashtags to my posts._

### Acceptance Criteria

1. Channel-specific default hashtag configuration with simple text input per channel
2. One-click insertion of default hashtag sets into post captions
3. Default hashtag management interface for editing channel defaults
4. Single default hashtag set per channel

## Story 2.6: Text Snippet Library

_As a content creator, I want to create and manage reusable text snippets for common caption elements, so that I can efficiently compose posts with consistent promotional text and links._

### Acceptance Criteria

1. Text snippet creation interface with name and content
2. Snippet library management for adding, editing, and deleting snippets
3. Quick insertion of snippets into caption composition interface at cursor location

## Story 2.7: Post Title Management

_As a content creator, I want to add titles to posts for ManyVids and Clips4Sale channels, so that I can provide additional context for platforms that support titles._

### Acceptance Criteria

1. Title field in post creation and editing interface, visible only for ManyVids and Clips4Sale channel types
2. Title character limits validation for ManyVids and Clips4Sale platforms
3. Title search functionality across all posts
4. Post listing view uses title when available, otherwise shows beginning of caption
5. Title field hidden for all other channel types (Fansly, Reddit, etc.)

## Story 2.8: Post Composition Workflow Integration

_As a content creator, I want seamless integration between content selection and post composition, so that I can efficiently create posts directly from my content browser._

### Acceptance Criteria

1. "Create Post" action available from content browser multi-select
2. Direct transition from content selection to post composition interface
3. Pre-populated post with selected media items in proper order
4. Drag-and-drop reordering of media items within post composition
5. Add/remove media items during post composition
6. Return to content browser functionality while preserving post draft
7. Post composition sidebar or modal overlay for seamless workflow
