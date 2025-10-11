import { Effect } from 'effect';
import { tryPromise } from 'effect/Effect';
import ffmpeg from 'fluent-ffmpeg';
import type { VideoMetadata } from '../metadata/extract-video-metadata';
import { thumbnailDimensions } from './thumbnail-dimensions';
import { ThumbnailError } from './thumbnail-error';
import { generateThumbnailPath } from './thumbnail-path';

export const generateVideoThumbnail = Effect.fn('generateVideoThumbnail')(
  function* (absolutePath: string, mediaMetadata: VideoMetadata) {
    const thumbnailPath = yield* generateThumbnailPath(absolutePath);
    const { width, height } = thumbnailDimensions(
      mediaMetadata.width,
      mediaMetadata.height
    );
    const seekTime = Math.max(1, Math.floor(mediaMetadata.duration * 0.1));

    yield* tryPromise({
      try: () =>
        new Promise<void>((resolve, reject) => {
          ffmpeg(absolutePath)
            .screenshots({
              timestamps: [seekTime],
              filename: thumbnailPath.split('/').pop() || 'thumbnail.jpg',
              folder: thumbnailPath.substring(
                0,
                thumbnailPath.lastIndexOf('/')
              ),
              size: `${width}x${height}`,
            })
            .on('end', () => resolve())
            .on('error', (error: Error) => reject(error));
        }),
      catch: (error) =>
        new ThumbnailError({
          absolutePath,
          cause: error as Error,
        }),
    });

    return thumbnailPath;
  }
);
