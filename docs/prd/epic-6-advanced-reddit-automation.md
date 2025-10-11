# Epic 6: Advanced Reddit Automation

**Expanded Goal**: Implement sophisticated Reddit posting automation with intelligent scheduling, conflict detection, and automated posting through Playwright integration.

## Story 6.1: Subreddit Management System

_As a content creator, I want to manage detailed subreddit information and posting rules, so that I can maintain compliance and optimize posting strategies across different Reddit communities._

### Acceptance Criteria

1. Subreddit creation interface with name, member count, and max post frequency (hours)
2. Verification status tracking (Not needed, Needed, Applied, Rejected, Verified, Banned)
3. Default flair configuration per subreddit with simple text input field
4. Notes field for custom subreddit rules and observations
5. Media eligibility filter assignment per subreddit using Epic 5's filter system
6. Subreddit editing and bulk management operations
7. Integration with Reddit channel configuration for seamless workflow

## Story 6.2: RedGIFs URL Import and Discovery System

_As a content creator, I want to import existing RedGIFs URLs for my media content through bulk discovery, so that I can leverage existing RedGIFs posts for Reddit link automation and cross-platform posting._

### Acceptance Criteria

1. "Import RedGIFs URLs" button in settings interface with bulk import operation
2. Media scanning to identify items without existing RedGIFs posts, creating processing pool
3. Postpone API integration using media filename for URL discovery with Effect type error handling
4. Automatic post entity creation when URLs found (media reference, RedGIFs URL, RedGIFs channel, timestamp)
5. Real-time progress tracking with pause/resume, success/failure counters, and detailed error logging
6. Integration with existing systems: channel management, post history tracking, and Reddit automation support

## Story 6.3: Automated Reddit Scheduling Engine

_As a content creator, I want intelligent Reddit post scheduling that respects subreddit rules and optimal timing, so that I can maximize engagement while maintaining compliance._

### Acceptance Criteria

1. Optimal timing calculation per subreddit based on community activity patterns
2. Random media selection from eligible content pools per subreddit filter rules
3. Conflict detection preventing posts within subreddit max frequency limits
4. Media duplication protection preventing same content to same subreddit within configurable days
5. Scheduling queue management with priority and timing optimization
6. Schedule preview showing planned posts with conflict warnings
7. Manual override capabilities for urgent or special posts

## Story 6.4: Playwright Reddit Automation

_As a content creator, I want automated Reddit posting through browser automation, so that I can maintain consistent posting schedules without manual intervention._

### Acceptance Criteria

1. Playwright automation integration using existing library
2. Automated login and session management for Reddit accounts
3. Automated post creation with title, content, flair, and RedGIFs URL integration through link posts
4. Integration with RedGIFs post entities to retrieve URLs for Reddit link post creation
5. Error handling with clear failure reporting (no retry logic to prevent duplicate posts)
6. Post success verification and status updates in FansLib
7. Rate limiting and anti-detection measures: Browser behavior randomization, user-agent rotation, session management, CAPTCHA detection and graceful failure handling
8. Multiple Reddit account support with account rotation

## Story 6.5: Reddit Analytics and Monitoring

_As a content creator, I want visibility into my Reddit posting performance and automation status, so that I can optimize my strategy and troubleshoot issues._

### Acceptance Criteria

1. Reddit posting dashboard showing recent automated posts and their status
2. Subreddit performance tracking with engagement metrics preparation
3. Reddit account health status monitoring per account
4. Posting frequency analysis and compliance monitoring
5. Integration with homepage dashboard widgets from Epic 3
