import { Effect } from 'effect';
import {
  isFileSupported,
  isImageFile,
  isVideoFile,
  UnsupportedFormatError,
} from '~/modules/files/formats';
import {
  extractImageMetadata,
  type ImageMetadata,
} from './extract-image-metadata';
import {
  extractVideoMetadata,
  type VideoMetadata,
} from './extract-video-metadata';

export const isVideoMetadata = (
  metadata: MediaMetadata
): metadata is VideoMetadata => 'duration' in metadata;

export type MediaMetadata = ImageMetadata | VideoMetadata;

export const extractMediaMetadata = Effect.fn('extractMediaMetadata')(
  function* (absolutePath: string) {
    const isSupported = yield* isFileSupported(absolutePath);
    if (!isSupported) {
      return yield* Effect.fail(new UnsupportedFormatError({ absolutePath }));
    }

    if (isImageFile(absolutePath)) {
      return yield* extractImageMetadata(absolutePath);
    }

    if (isVideoFile(absolutePath)) {
      return yield* extractVideoMetadata(absolutePath);
    }

    return yield* Effect.fail(new UnsupportedFormatError({ absolutePath }));
  }
);
