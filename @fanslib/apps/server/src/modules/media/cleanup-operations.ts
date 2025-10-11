import { Effect } from 'effect';
import { inArray } from 'drizzle-orm';
import { dbLive } from '~/services/database';
import { mediaTable } from '../../../../../libraries/db/src/schema';
import type { FileMetadata } from '../files/extract-metadata';

export class CleanupError {
  readonly _tag = 'CleanupError';
  constructor(
    readonly message: string,
    readonly context?: string
  ) {}
}

/**
 * Gets media items that should be removed from database
 */
const getMediaItemsToRemove = Effect.fn('getMediaItemsToRemove')(
  function* (existingFilePaths: string[]) {
    const allDbMedia = yield* Effect.tryPromise({
      try: () =>
        dbLive
          .select({ id: mediaTable.id, filepath: mediaTable.filepath })
          .from(mediaTable),
      catch: (error) =>
        new CleanupError(
          error instanceof Error
            ? error.message
            : 'Failed to fetch media items',
          'getMediaItemsToRemove'
        ),
    });

    const existingPathsSet = new Set(existingFilePaths);

    return allDbMedia
      .filter((dbItem) => !existingPathsSet.has(dbItem.filepath))
      .map((dbItem) => dbItem.id);
  }
);

/**
 * Removes a single media item
 */
const removeMediaItem = Effect.fn('removeMediaItem')(function* (mediaId: number) {
  yield* Effect.tryPromise({
    try: () => dbLive.delete(mediaTable).where(inArray(mediaTable.id, [mediaId])),
    catch: (error) =>
      new CleanupError(
        error instanceof Error
          ? error.message
          : 'Failed to remove media item',
        `mediaId-${mediaId}`
      ),
  });
});

/**
 * Removes media items from database that no longer exist in file system
 */
export const cleanupRemovedMedia = Effect.fn('cleanupRemovedMedia')(
  function* (existingFilePaths: string[]) {
    const mediaIdsToRemove = yield* getMediaItemsToRemove(existingFilePaths);

    if (mediaIdsToRemove.length === 0) {
      yield* Effect.log('No media items to remove');
      return 0;
    }

    yield* Effect.log(`Removing ${mediaIdsToRemove.length} media items`);

    yield* Effect.all(
      mediaIdsToRemove.map((mediaId) =>
        removeMediaItem(mediaId).pipe(
          Effect.catchAll((error) =>
            Effect.gen(function* () {
              yield* Effect.logError(error);
            })
          )
        )
      ),
      { concurrency: 100 }
    );

    yield* Effect.log(`Removed ${mediaIdsToRemove.length} media items`);

    return mediaIdsToRemove.length;
  }
);

/**
 * Performs cleanup operation and returns count of removed items
 */
export const performCleanupOperation = Effect.fn('performCleanupOperation')(
  function* (fileMetadatas: FileMetadata[]) {
    const filePaths = fileMetadatas.map((info) => info.relativePath);
    return yield* cleanupRemovedMedia(filePaths);
  }
);
