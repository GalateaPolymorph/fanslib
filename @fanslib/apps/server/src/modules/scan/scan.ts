import type { CreateMedia } from '@fanslib/db';
import { Effect, pipe } from 'effect';
import type { FileMetadata } from '../files/extract-metadata';
import { scanMediaRoot } from '../files/scan-media-root';
import {
  extractMediaMetadata,
  isVideoMetadata,
  type MediaMetadata,
} from '../media/metadata/extract-media-metadata';
import { generateThumbnail } from '../media/thumbnail/generate-thumbnail';
import { upsertMedia } from '../media/upsert-media';
import { syncShoot } from '../shoots/sync-shoots';
import {
  initializeScanFiles,
  initialScanStatus,
  ScanStatus,
  startScan,
  stopScan,
  updateFileStatus,
} from './scan-status';

const createMediaFromMetadata = (
  fileMetadata: FileMetadata,
  mediaMetadata: MediaMetadata,
  thumbnailPath: string,
  shootId: number | undefined
) => {
  const media: CreateMedia = {
    filepath: fileMetadata.relativePath,
    filesize: BigInt(fileMetadata.fileSize),
    contentHash: fileMetadata.contentHash,
    width: mediaMetadata.width,
    height: mediaMetadata.height,
    duration: isVideoMetadata(mediaMetadata)
      ? mediaMetadata.duration
      : undefined,
    mimeType: fileMetadata.mimeType,
    fileCreatedAt: fileMetadata.createdAt,
    fileModifiedAt: fileMetadata.modifiedAt,
    thumbnailPath,
    shootId,
  };
  return media;
};

const syncFile = Effect.fn('syncFile')(function* (file: FileMetadata) {
  const metadata = yield* extractMediaMetadata(file.absolutePath);
  yield* updateFileStatus(file.absolutePath, { status: 'metadataExtracted' });

  const shootResult = yield* syncShoot(file);
  const thumbnailPath = yield* generateThumbnail(file.absolutePath, metadata);

  yield* updateFileStatus(file.absolutePath, { status: 'thumbnailGenerated' });

  yield* upsertMedia(
    createMediaFromMetadata(
      file,
      metadata,
      thumbnailPath,
      shootResult?.shoot?.id
    )
  );

  yield* updateFileStatus(file.absolutePath, { status: 'databaseUpdated' });
});

const syncFiles = Effect.fn('syncFiles')(function* (files: FileMetadata[]) {
  return yield* Effect.all(
    files.map((file) =>
      syncFile(file).pipe(
        Effect.catchAll((error) =>
          Effect.gen(function* () {
            yield* Effect.logError(error);
            yield* updateFileStatus(file.absolutePath, {
              status: 'error',
              error: `${error._tag}: ${error.message}`,
            });
          })
        )
      )
    )
  );
});

export const executeScan = Effect.gen(function* () {
  const scan = pipe(
    startScan(),
    Effect.andThen(scanMediaRoot),
    Effect.tap((files) =>
      initializeScanFiles(files.map((f) => f.absolutePath))
    ),
    Effect.andThen(syncFiles),
    Effect.ensuring(stopScan()),
    Effect.withLogSpan('Scan 🔎')
  );

  return yield* Effect.provideServiceEffect(
    scan,
    ScanStatus,
    initialScanStatus()
  );
});
