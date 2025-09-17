# Requirements

## Functional

**FR1**: The system shall import and organize content files with shoot-based grouping and intelligent tagging capabilities
**FR2**: The system shall provide multi-dimensional filtering with AND/OR groups and NOT modifiers for precise content discovery  
**FR3**: The system shall display content in a thumbnail-based visual browser for efficient identification and selection
**FR4**: The system shall track complete posting history through post entities that can contain multiple media items, assigned to specific timestamps and channels/platforms
**FR5**: The system shall provide visual indicators to prevent accidental reposts to the same platform
**FR6**: The system shall support cross-platform scheduling for Fansly, ManyVids, Reddit, Bluesky, RedGIFs, and Clips4Sale
**FR7**: The system shall accommodate different platform requirements and posting frequencies in scheduling
**FR8**: The system shall display a content status dashboard showing utilization across all platforms
**FR9**: The system shall calculate and display content runway (days/weeks of unused content) per platform
**FR10**: The system shall enable batch operations for tagging, scheduling, and organization of multiple content items
**FR11**: The system shall support shoot-based content organization maintaining natural content relationships
**FR12**: The system shall provide advanced search capabilities returning results within 30 seconds
**FR13**: The system shall allow users to create custom tag dimensions with user-defined names and value sets
**FR14**: The system shall support exclusive tag dimensions where only one value can be selected per media item
**FR15**: The system shall support non-exclusive tag dimensions where multiple values can be selected per media item
**FR16**: The system shall enable dynamic assignment of tag dimension values to individual media items
**FR17**: The system shall use tag dimensions for automated content tier-based scheduling and platform eligibility filtering
**FR18**: The system shall provide tag dimension management interface for creating, editing, and organizing custom dimensions
**FR19**: The system shall require caption and optional title for each post entity with hashtag parsing and formatting support
**FR20**: The system shall provide channel-specific default hashtag configuration and management
**FR21**: The system shall enable one-click addition of default hashtags to post captions during post creation and editing
**FR22**: The system shall support text snippet library creation and management for reusable caption elements
**FR23**: The system shall provide quick insertion of text snippets into post captions during composition
**FR24**: The system shall parse and identify hashtags within post captions for future analytics integration

## Non Functional

**NFR1**: The system shall achieve content discovery response times under 30 seconds for any search query
**NFR2**: The system shall maintain 99.9% uptime during business hours (9 AM - 9 PM user timezone)
**NFR3**: The system shall support a content library of at least 10,000 items without performance degradation
**NFR4**: The system shall implement responsive design supporting desktop and mobile access
**NFR5**: The system shall follow functional programming principles with pure functions where applicable
**NFR6**: The system shall use TypeScript, React, BUN, and TurboRepo per technical preferences
**NFR7**: The system shall implement test-driven development with comprehensive test coverage
**NFR8**: The system shall use Tailwind CSS and Daisy UI for consistent styling and components
**NFR9**: The system shall implement Playwright MCP-backed integration tests for comprehensive end-to-end testing and AI agent development support
