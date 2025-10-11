import { Config, Effect } from 'effect';
import { fileExists } from '~/modules/files/file-exists';
import { isImageFile, isVideoFile } from '~/modules/files/formats';
import { makeDirectory } from '~/modules/files/make-directory';
import {
  isVideoMetadata,
  type MediaMetadata,
} from '../metadata/extract-media-metadata';
import { generateImageThumbnail } from './generate-image-thumbnail';
import { generateVideoThumbnail } from './generate-video-thumbnail';
import { ThumbnailError } from './thumbnail-error';

export const generateThumbnail = Effect.fn('generateThumbnail')(function* (
  absolutePath: string,
  mediaMetadata: MediaMetadata
) {
  const thumbnailRoot = yield* Config.string('THUMBNAIL_ROOT');
  yield* makeDirectory(thumbnailRoot);
  yield* fileExists(absolutePath);

  if (isImageFile(absolutePath)) {
    return yield* generateImageThumbnail(absolutePath);
  }

  if (isVideoFile(absolutePath) && isVideoMetadata(mediaMetadata)) {
    return yield* generateVideoThumbnail(absolutePath, mediaMetadata);
  }

  return yield* Effect.fail(
    new ThumbnailError({
      absolutePath,
      cause: new Error('Unsupported file type'),
    })
  );
});
