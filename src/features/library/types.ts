import { Media } from "../../lib/database/media/type";

export interface LibraryAPI {
  /**
   * Scan the library directory for media files
   * @param libraryPath Path to the library directory
   */
  scan: (libraryPath: string) => Promise<Media[]>;

  /**
   * Get all media from the database
   */
  getAllMedia: () => Promise<Media[]>;

  /**
   * Update a media item's metadata
   * @param path Path to the media file
   * @param updates Partial updates to apply
   */
  updateMedia: (path: string, updates: Partial<Media>) => Promise<Media>;

  /**
   * Reset the media database
   */
  resetDatabase: () => Promise<void>;
}
