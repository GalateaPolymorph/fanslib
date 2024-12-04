import { Post, RawPost } from "../../lib/database/posts/type";

export interface PostsAPI {
  /**
   * Create a new post
   * @param data Post data without id and timestamps
   */
  createPost: (data: Omit<RawPost, "id" | "createdAt" | "updatedAt">) => Promise<Post>;

  /**
   * Get all posts
   */
  getAllPosts: () => Promise<Post[]>;

  /**
   * Get posts for a specific schedule
   * @param scheduleId ID of the schedule
   */
  getPostsBySchedule: (scheduleId: string) => Promise<Post[]>;

  /**
   * Get posts for a specific channel
   * @param channelId ID of the channel
   */
  getPostsByChannel: (channelId: string) => Promise<Post[]>;

  /**
   * Get posts by media path
   * @param mediaPath Path to the media file
   */
  getByMediaPath: (mediaPath: string) => Promise<Post[]>;

  /**
   * Update a post
   * @param id Post ID
   * @param updates Partial post data to update
   */
  updatePost: (id: string, updates: Partial<RawPost>) => Promise<Post>;

  /**
   * Mark a post as scheduled
   * @param id Post ID
   */
  markAsScheduled: (id: string) => Promise<Post>;

  /**
   * Mark a post as posted
   * @param id Post ID
   */
  markAsPosted: (id: string) => Promise<Post>;

  /**
   * Mark a post as planned (unschedule)
   * @param id Post ID
   */
  markAsPlanned: (id: string) => Promise<Post>;

  /**
   * Delete a post
   * @param id Post ID
   */
  deletePost: (id: string) => Promise<void>;

  /**
   * Add media to a post
   * @param postId Post ID
   * @param mediaPaths Paths to media files
   */
  addMediaToPost: (postId: string, mediaPaths: string[]) => Promise<Post>;

  /**
   * Remove media from a post
   * @param postId Post ID
   * @param mediaPaths Paths to media files
   */
  removeMediaFromPost: (postId: string, mediaPaths: string[]) => Promise<Post>;

  /**
   * Reorder media in a post
   * @param postId Post ID
   * @param mediaPath Path to media file
   * @param newOrder New order index
   */
  reorderPostMedia: (postId: string, mediaPath: string, newOrder: number) => Promise<Post>;
}
