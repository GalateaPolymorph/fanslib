# Requirements Document

## Introduction

This feature will connect the Reddit Bulk Posting component to the server-based queue system, enabling automated posting through the server instead of storing drafts locally in the Electron SQLite database. Users will be able to schedule individual posts or entire batches to be processed by the server's automated posting system.

## Requirements

### Requirement 1

**User Story:** As a content creator, I want to schedule individual Reddit posts to the server queue, so that I can have granular control over which posts get automated posting.

#### Acceptance Criteria

1. WHEN a user clicks a "Schedule to Server" button on an individual post THEN the system SHALL send that post to the server queue
2. WHEN scheduling an individual post THEN the system SHALL validate that the server is available before proceeding
3. WHEN an individual post is successfully scheduled THEN the system SHALL remove it from the local generation grid
4. WHEN an individual post scheduling fails THEN the system SHALL display an error message and keep the post in the grid
5. IF the server is unavailable THEN the system SHALL disable individual scheduling buttons and show a warning

### Requirement 2

**User Story:** As a content creator, I want to schedule entire batches of Reddit posts to the server queue, so that I can efficiently automate multiple posts at once.

#### Acceptance Criteria

1. WHEN a user clicks "Schedule All to Server" THEN the system SHALL send all generated posts to the server queue
2. WHEN scheduling all posts THEN the system SHALL validate server availability before processing any posts
3. WHEN batch scheduling is successful THEN the system SHALL clear the entire generation grid
4. WHEN some posts in a batch fail to schedule THEN the system SHALL show which posts failed and keep only failed posts in the grid
5. IF the server is unavailable THEN the system SHALL disable the batch scheduling button and show a warning

### Requirement 3

**User Story:** As a content creator, I want to see server-queued posts in the scheduled posts list, so that I can monitor all my automated posting activity in one place.

#### Acceptance Criteria

1. WHEN viewing the scheduled posts list THEN the system SHALL display only server-queued posts
2. WHEN displaying server-queued posts THEN the system SHALL show their queue status (queued, processing, posted, failed)
3. WHEN a server-queued post status changes THEN the system SHALL update the display in real-time
4. IF a server post fails THEN the system SHALL display the error message in the scheduled posts list

### Requirement 4

**User Story:** As a content creator, I want all posts to be scheduled directly to the server queue, so that I have a unified automated posting system.

#### Acceptance Criteria

1. WHEN generating posts THEN the system SHALL only provide server scheduling options
2. WHEN the server is unavailable THEN the system SHALL disable all scheduling functionality and show an error message
3. WHEN scheduling posts THEN the system SHALL send them directly to the server queue without local storage
4. WHEN the server becomes available after being unavailable THEN the system SHALL re-enable scheduling functionality

### Requirement 5

**User Story:** As a content creator, I want to cancel server-queued posts, so that I can modify my posting schedule when needed.

#### Acceptance Criteria

1. WHEN viewing server-queued posts THEN the system SHALL provide a cancel/delete option for queued posts
2. WHEN canceling a server-queued post THEN the system SHALL send a delete request to the server
3. WHEN a server post is successfully canceled THEN the system SHALL remove it from the scheduled posts list
4. WHEN canceling fails THEN the system SHALL show an error message and keep the post in the list
5. IF a post is already processing or posted THEN the system SHALL disable the cancel option

### Requirement 6

**User Story:** As a content creator, I want to see server connection status, so that I know whether automated posting is available.

#### Acceptance Criteria

1. WHEN loading the bulk posting interface THEN the system SHALL check and display server connection status
2. WHEN the server connection changes THEN the system SHALL update the status indicator in real-time
3. WHEN the server is connected THEN the system SHALL show a green indicator with "Server Connected" message
4. WHEN the server is disconnected THEN the system SHALL show a red indicator with "Server Unavailable" message
