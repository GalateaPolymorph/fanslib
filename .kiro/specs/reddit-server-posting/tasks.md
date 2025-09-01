# Implementation Plan

- [ ] 1. Update GeneratedPost type and post generation logic

  - Add unique ID field to GeneratedPost type definition
  - Modify post generation operations to assign unique IDs to each generated post
  - Update existing GeneratedPost usage throughout the codebase
  - _Requirements: 1.1, 2.1_

- [ ] 2. Create server scheduling API functions

  - [ ] 2.1 Implement schedulePostsToServer function

    - Create unified function that accepts array of GeneratedPost objects
    - Convert GeneratedPost objects to CreateQueueJobRequest format
    - Handle both single post and batch scheduling through same API
    - Add proper error handling and response validation
    - _Requirements: 1.1, 2.1_

  - [ ] 2.2 Add server availability checking
    - Implement checkServerAvailability function using existing server-communication API
    - Add periodic server status polling mechanism
    - Create error handling for server connectivity issues
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 3. Enhance PostGenerationGrid component for individual scheduling

  - [ ] 3.1 Add individual schedule buttons to post cards

    - Add "Schedule" button to each PostGenerationCard
    - Implement loading states for individual post scheduling
    - Add server availability validation before enabling buttons
    - Handle scheduling success by removing post from grid
    - _Requirements: 1.1, 1.3, 1.5_

  - [ ] 3.2 Update PostGenerationGrid props and state management
    - Add onScheduleIndividualPost prop to component interface
    - Add isSchedulingPost prop to track which post is being scheduled
    - Add isServerAvailable prop to control button states
    - Update component to handle new scheduling workflow
    - _Requirements: 1.1, 1.5_

- [ ] 4. Modify RedditBulkPostGenerator for server-only scheduling

  - [ ] 4.1 Replace local scheduling with server scheduling

    - Remove existing scheduleAllPosts local database logic
    - Implement scheduleAllPostsToServer using new API functions
    - Add server availability checking on component mount
    - Update batch scheduling to use server queue instead of local storage
    - _Requirements: 2.1, 2.2, 4.1, 4.3_

  - [ ] 4.2 Add server connection status management

    - Add server availability state management
    - Implement periodic server status checking
    - Add server connection error handling and user feedback
    - Create server status indicator in UI
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 4.3 Implement individual post scheduling logic
    - Add scheduleIndividualPost method to component
    - Handle individual post scheduling with proper error handling
    - Update post removal logic after successful scheduling
    - Add scheduling state management for individual posts
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 5. Update ScheduledPostsList to display server queue jobs

  - [x] 5.1 Modify getScheduledPosts to include server jobs

    - Update existing getScheduledPosts function to fetch server queue jobs
    - Do not return local posts
    - Add proper sorting by scheduled date
    - Handle server job status mapping to ScheduledPost format
    - _Requirements: 3.1, 3.2_

  - [x] 5.2 Add server job status display and management

    - Add queue status badges for server jobs (queued, processing, posted, failed)
    - Implement visual distinction between server and local posts
    - Add error message display for failed server jobs
    - Create real-time status update mechanism
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [x] 5.3 Implement server job cancellation
    - Add cancel/delete buttons for queued server jobs
    - Implement deleteServerJob function using server-communication API
    - Add proper error handling for cancellation failures
    - Disable cancel option for processing/posted jobs
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 6. Add comprehensive error handling and user feedback

  - [x] 6.1 Implement scheduling error handling

    - Create SchedulingError type and error categorization
    - Add error toast notifications for scheduling failures
    - Implement retry mechanisms for retryable errors
    - Handle partial batch scheduling failures
    - _Requirements: 1.4, 2.4, 4.2, 4.5_

  - [x] 6.2 Add server unavailability handling
    - Disable all scheduling functionality when server unavailable
    - Show clear error messages and guidance for server issues
    - Implement graceful degradation with helpful user messaging
    - Add server connection troubleshooting guidance
    - _Requirements: 4.2, 4.5, 6.4_

- [x] 7. Update UI components and user experience

  - [x] 7.1 Add server connection status indicator

    - Create server status indicator component
    - Add connection status display to bulk posting interface
    - Implement real-time status updates with appropriate colors/icons
    - Add tooltips explaining server connection status
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 7.2 Enhance scheduling button states and feedback
    - Update "Schedule All" button to reflect server-only scheduling
    - Add loading states and progress indicators for batch operations
    - Implement proper button disabled states based on server availability
    - Add contextual help text explaining server-based scheduling
    - _Requirements: 2.1, 2.2, 4.1, 4.2_

- [x] 8. Clean up local scheduling remnants (for reddit bulk posting)
  - Remove unused local scheduling database operations
  - Update API type definitions to reflect server-only scheduling
  - Clean up any remaining references to local post scheduling
  - Update component imports and dependencies
  - _Requirements: 4.1, 4.3_
