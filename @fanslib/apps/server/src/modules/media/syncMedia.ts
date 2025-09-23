import { sequentially } from '@fanslib/utils';
import { eq, inArray } from 'drizzle-orm';
import { dirname } from 'path';
import { db } from '~/db/connection';
import {
  mediaTable,
  shootsTable,
} from '../../../../../libraries/db/src/schema';
import type { MediaFileInfo } from '../filesystem/fileScanner';
import { detectShootFromFolder, getShootForMediaFile } from './shootDetection';
import { syncShootsToDatabase } from './syncShoot';
import { upsertMediaItem, type MediaSyncError } from './upsertMedia';

export type MediaSyncResult = {
  success: boolean;
  totalFiles: number;
  newFiles: number;
  updatedFiles: number;
  errors: MediaSyncError[];
};

/**
 * Gets shoot ID for a media file if shoot assignment is enabled
 */
const getShootIdForMediaFile = async (
  mediaFilePath: string,
  contentRootPath: string,
  assignShoots: boolean
): Promise<number | null> => {
  if (!assignShoots) {
    return null;
  }

  const shootResult = await getShootForMediaFile(
    mediaFilePath,
    contentRootPath
  );

  if (!shootResult.hasShoot || !shootResult.shootInfo) {
    return null;
  }

  const dbShoot = await db
    .select()
    .from(shootsTable)
    .where(eq(shootsTable.folderpath, shootResult.shootInfo.folderPath))
    .limit(1);

  return dbShoot.length > 0 ? (dbShoot[0]?.id ?? null) : null;
};

/**
 * Checks if a media file is new (doesn't exist in database)
 */
const isNewMediaFile = async (filePath: string): Promise<boolean> => {
  const existingMedia = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.filepath, filePath))
    .limit(1);

  return existingMedia.length === 0;
};

/**
 * Processes a single media file
 */
const processSingleMediaFile = async (
  mediaFileInfo: MediaFileInfo,
  contentRootPath: string,
  assignShoots: boolean,
  includeMetadata: boolean,
  includeThumbnails: boolean
): Promise<{
  success: boolean;
  isNew: boolean;
  mediaId?: string;
  error?: MediaSyncError;
}> => {
  try {
    const shootId = await getShootIdForMediaFile(
      mediaFileInfo.filePath,
      contentRootPath,
      assignShoots
    );

    const isNew = await isNewMediaFile(mediaFileInfo.filePath);

    const result = await upsertMediaItem(
      mediaFileInfo,
      contentRootPath,
      shootId,
      includeMetadata ? undefined : undefined, // TODO: Add metadata extraction
      includeThumbnails ? undefined : undefined // TODO: Add thumbnail path
    );

    if (result.success) {
      return {
        success: true,
        isNew,
        mediaId: result.data.id.toString(),
      };
    }

    return {
      success: false,
      isNew,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      isNew: false,
      error: {
        type: 'database_error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error during media sync',
        filePath: mediaFileInfo.filePath,
      },
    };
  }
};

/**
 * Collects unique shoot folders from media files
 */
const collectShootFolders = (mediaFileInfos: MediaFileInfo[]): Set<string> =>
  mediaFileInfos.reduce((shootFolders, mediaInfo) => {
    const mediaDir = dirname(mediaInfo.filePath);
    shootFolders.add(mediaDir);
    return shootFolders;
  }, new Set<string>());

/**
 * Syncs shoots to database from folder paths
 */
const syncShootsFromFolders = async (
  shootFolders: Set<string>,
  contentRootPath: string
): Promise<void> => {
  const shootResults = await Promise.all(
    Array.from(shootFolders).map(async (folderPath) => {
      try {
        const shootResult = await detectShootFromFolder(
          folderPath,
          contentRootPath
        );
        return shootResult.success ? shootResult.data : null;
      } catch {
        // Not a shoot folder, which is fine
        return null;
      }
    })
  );

  const shootInfos = shootResults.filter(
    (info): info is NonNullable<typeof info> => info !== null
  );

  if (shootInfos.length > 0) {
    await syncShootsToDatabase(shootInfos);
  }
};

/**
 * Processes results from media file processing
 */
const processMediaResults = (
  results: Array<{
    success: boolean;
    isNew: boolean;
    mediaId?: string;
    error?: MediaSyncError;
  }>
): {
  errors: MediaSyncError[];
  newFiles: string[];
  updatedFiles: string[];
} =>
  results.reduce(
    (acc, result) => {
      if (result.success && result.mediaId) {
        if (result.isNew) {
          return {
            ...acc,
            newFiles: [...acc.newFiles, result.mediaId],
          };
        }
        return {
          ...acc,
          updatedFiles: [...acc.updatedFiles, result.mediaId],
        };
      }

      if (result.error) {
        return {
          ...acc,
          errors: [...acc.errors, result.error],
        };
      }

      return acc;
    },
    {
      errors: [] as MediaSyncError[],
      newFiles: [] as string[],
      updatedFiles: [] as string[],
    }
  );

/**
 * Syncs media files to database with shoot assignment
 */
export const syncMediaToDatabase = async (
  mediaFileInfos: MediaFileInfo[],
  contentRootPath: string,
  options: {
    assignShoots?: boolean;
    includeMetadata?: boolean;
    includeThumbnails?: boolean;
  } = {}
): Promise<MediaSyncResult> => {
  const {
    assignShoots = true,
    includeMetadata = false,
    includeThumbnails = false,
  } = options;

  // First, collect all unique shoot folders if shoot assignment is enabled
  if (assignShoots) {
    const shootFolders = collectShootFolders(mediaFileInfos);
    await syncShootsFromFolders(shootFolders, contentRootPath);
  }

  // Process media files in batches
  const BATCH_SIZE = 20;
  const batches = Array.from(
    { length: Math.ceil(mediaFileInfos.length / BATCH_SIZE) },
    (_, i) => mediaFileInfos.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
  );

  const allResults = await sequentially(
    batches.map(
      (batch) => () =>
        Promise.all(
          batch.map((mediaFileInfo) =>
            processSingleMediaFile(
              mediaFileInfo,
              contentRootPath,
              assignShoots,
              includeMetadata,
              includeThumbnails
            )
          )
        )
    )
  );

  const flatResults = allResults.flat();
  const { errors, newFiles, updatedFiles } = processMediaResults(flatResults);

  return {
    success: errors.length === 0,
    totalFiles: mediaFileInfos.length,
    newFiles: newFiles.length,
    updatedFiles: updatedFiles.length,
    errors,
  };
};

/**
 * Gets media items that should be removed from database
 */
const getMediaItemsToRemove = async (
  existingFilePaths: string[]
): Promise<number[]> => {
  const allDbMedia = await db
    .select({ id: mediaTable.id, filepath: mediaTable.filepath })
    .from(mediaTable);

  const existingPathsSet = new Set(existingFilePaths);

  return allDbMedia
    .filter((dbItem) => !existingPathsSet.has(dbItem.filepath))
    .map((dbItem) => dbItem.id);
};

/**
 * Removes media items in batches
 */
const removeMediaInBatches = async (
  mediaIds: number[]
): Promise<{
  totalRemoved: number;
  errors: MediaSyncError[];
}> => {
  const BATCH_SIZE = 100;
  const removeBatches = Array.from(
    { length: Math.ceil(mediaIds.length / BATCH_SIZE) },
    (_, i) => mediaIds.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
  );

  const errors: MediaSyncError[] = [];

  const removeResults = await Promise.all(
    removeBatches.map(async (batch, batchIndex) => {
      try {
        await db.delete(mediaTable).where(inArray(mediaTable.id, batch));
        return { success: true, count: batch.length };
      } catch (error) {
        errors.push({
          type: 'database_error',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to remove media batch',
          filePath: `batch-${batchIndex + 1}`,
        });
        return { success: false, count: 0 };
      }
    })
  );

  const totalRemoved = removeResults.reduce(
    (sum, result) => sum + (result.success ? result.count : 0),
    0
  );

  return { totalRemoved, errors };
};

/**
 * Removes media items from database that no longer exist in file system
 */
export const cleanupRemovedMedia = async (
  existingFilePaths: string[]
): Promise<{
  success: boolean;
  removedCount: number;
  errors: MediaSyncError[];
}> => {
  try {
    const mediaIdsToRemove = await getMediaItemsToRemove(existingFilePaths);

    if (mediaIdsToRemove.length === 0) {
      return { success: true, removedCount: 0, errors: [] };
    }

    const { totalRemoved, errors } =
      await removeMediaInBatches(mediaIdsToRemove);

    return {
      success: errors.length === 0,
      removedCount: totalRemoved,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      removedCount: 0,
      errors: [
        {
          type: 'database_error',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to cleanup removed media',
          filePath: 'cleanup-operation',
        },
      ],
    };
  }
};

/**
 * Performs cleanup and returns result with proper typing
 */
const performCleanupOperation = async (
  mediaFileInfos: MediaFileInfo[]
): Promise<{ removedCount: number; errors: MediaSyncError[] }> => {
  const filePaths = mediaFileInfos.map((info) => info.filePath);
  const cleanup = await cleanupRemovedMedia(filePaths);

  return {
    removedCount: cleanup.removedCount,
    errors: cleanup.errors,
  };
};

/**
 * Performs a complete sync operation combining file scanning and database sync
 */
export const performFullSync = async (
  mediaFileInfos: MediaFileInfo[],
  contentRootPath: string,
  options: {
    assignShoots?: boolean;
    includeMetadata?: boolean;
    includeThumbnails?: boolean;
    cleanupRemoved?: boolean;
  } = {}
): Promise<{
  success: boolean;
  mediaSyncResult: MediaSyncResult;
  cleanupResult?:
    | { removedCount: number; errors: MediaSyncError[] }
    | undefined;
  errors: MediaSyncError[];
}> => {
  const { cleanupRemoved = true, ...syncOptions } = options;
  const allErrors: MediaSyncError[] = [];

  // Sync media and shoots
  const mediaSyncResult = await syncMediaToDatabase(
    mediaFileInfos,
    contentRootPath,
    syncOptions
  );
  allErrors.push(...mediaSyncResult.errors);

  // Cleanup removed files if requested
  const cleanupResult = cleanupRemoved
    ? await (async () => {
        const result = await performCleanupOperation(mediaFileInfos);
        allErrors.push(...result.errors);
        return result;
      })()
    : undefined;

  return {
    success: allErrors.length === 0,
    mediaSyncResult,
    cleanupResult,
    errors: allErrors,
  };
};
