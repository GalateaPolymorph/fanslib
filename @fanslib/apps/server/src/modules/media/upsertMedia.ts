import { mediaTable, type CreateMedia, type Media } from '@fanslib/db';
import { eq, isNull } from 'drizzle-orm';
import { db } from '../../db/connection';
import type { MediaFileInfo } from '../filesystem/fileScanner';

export type MediaSyncError = {
  type: 'database_error' | 'validation_error' | 'shoot_assignment_error';
  message: string;
  filePath: string;
};

export type DatabaseMediaItem = Media;

/**
 * Creates media data object from file info
 */
const createMediaData = (
  mediaFileInfo: MediaFileInfo,
  shootId?: number | null,
  thumbnailPath?: string
): CreateMedia => ({
  filepath: mediaFileInfo.filePath,
  filesize: BigInt(mediaFileInfo.fileSize),
  contentHash: mediaFileInfo.contentHash,
  width: 0, // TODO: Extract from metadata
  height: 0, // TODO: Extract from metadata
  duration: null, // TODO: Extract from metadata for videos
  mimeType: mediaFileInfo.mimeType,
  fileCreatedAt: mediaFileInfo.createdAt,
  fileModifiedAt: mediaFileInfo.modifiedAt,
  shootId: shootId ?? null,
  thumbnailPath: thumbnailPath ?? '',
  updatedAt: new Date(),
});

/**
 * Gets existing media item by file path
 */
const getExistingMediaByPath = async (
  filePath: string
): Promise<DatabaseMediaItem | null> => {
  const existingMedia = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.filepath, filePath))
    .limit(1);

  return existingMedia.length > 0
    ? (existingMedia[0] as DatabaseMediaItem)
    : null;
};

/**
 * Updates an existing media item
 */
const updateExistingMedia = async (
  existingMediaId: number,
  mediaData: ReturnType<typeof createMediaData>
): Promise<
  | { success: true; data: DatabaseMediaItem }
  | { success: false; error: MediaSyncError }
> => {
  try {
    const updated = await db
      .update(mediaTable)
      .set(mediaData)
      .where(eq(mediaTable.id, existingMediaId))
      .returning();

    if (updated.length === 0) {
      return {
        success: false,
        error: {
          type: 'database_error',
          message: 'Failed to update existing media item',
          filePath: 'unknown',
        },
      };
    }

    return {
      success: true,
      data: updated[0] as DatabaseMediaItem,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message:
          error instanceof Error ? error.message : 'Failed to update media',
        filePath: 'unknown',
      },
    };
  }
};

/**
 * Creates a new media item
 */
const createNewMedia = async (
  mediaFileInfo: MediaFileInfo,
  mediaData: ReturnType<typeof createMediaData>
): Promise<
  | { success: true; data: DatabaseMediaItem }
  | { success: false; error: MediaSyncError }
> => {
  try {
    const inserted = await db
      .insert(mediaTable)
      .values({
        ...mediaData,
        filepath: mediaFileInfo.filePath,
        createdAt: new Date(),
      })
      .returning();

    if (inserted.length === 0) {
      return {
        success: false,
        error: {
          type: 'database_error',
          message: 'Failed to create new media item',
          filePath: mediaFileInfo.filePath,
        },
      };
    }

    return {
      success: true,
      data: inserted[0] as DatabaseMediaItem,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message:
          error instanceof Error ? error.message : 'Failed to create media',
        filePath: mediaFileInfo.filePath,
      },
    };
  }
};

/**
 * Creates or updates a media item in the database
 */
export const upsertMediaItem = async (
  mediaFileInfo: MediaFileInfo,
  contentRootPath: string,
  shootId?: number | null,
  metadata?: Record<string, unknown>,
  thumbnailPath?: string
): Promise<
  | { success: true; data: DatabaseMediaItem }
  | { success: false; error: MediaSyncError }
> => {
  try {
    const existingMedia = await getExistingMediaByPath(mediaFileInfo.filePath);
    const mediaData = createMediaData(mediaFileInfo, shootId, thumbnailPath);

    if (existingMedia) {
      return await updateExistingMedia(existingMedia.id, mediaData);
    }

    return await createNewMedia(mediaFileInfo, mediaData);
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message:
          error instanceof Error ? error.message : 'Unknown database error',
        filePath: mediaFileInfo.filePath,
      },
    };
  }
};

/**
 * Gets media items by shoot ID with error handling
 */
const getMediaItemsByShootId = async (
  shootId: number
): Promise<DatabaseMediaItem[]> => {
  const mediaItems = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.shootId, shootId))
    .orderBy(mediaTable.filepath);

  return mediaItems as DatabaseMediaItem[];
};

/**
 * Gets media items by shoot ID
 */
export const getMediaByShoot = async (
  shootId: number
): Promise<
  | { success: true; data: DatabaseMediaItem[] }
  | { success: false; error: string }
> => {
  try {
    const data = await getMediaItemsByShootId(shootId);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get media by shoot',
    };
  }
};

/**
 * Gets unassigned media items with error handling
 */
const getUnassignedMediaItems = async (): Promise<DatabaseMediaItem[]> => {
  const unassignedMedia = await db
    .select()
    .from(mediaTable)
    .where(isNull(mediaTable.shootId))
    .orderBy(mediaTable.filepath);

  return unassignedMedia as DatabaseMediaItem[];
};

/**
 * Gets media items without shoot assignment
 */
export const getUnassignedMedia = async (): Promise<
  | { success: true; data: DatabaseMediaItem[] }
  | { success: false; error: string }
> => {
  try {
    const data = await getUnassignedMediaItems();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get unassigned media',
    };
  }
};
