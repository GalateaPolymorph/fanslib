import { Effect } from 'effect';
import { tryPromise } from 'effect/Effect';
import sharp from 'sharp';
import { thumbnailDimensions } from './thumbnail-dimensions';
import { ThumbnailError } from './thumbnail-error';
import { generateThumbnailPath } from './thumbnail-path';

export const generateImageThumbnail = Effect.fn('generateImageThumbnail')(
  function* (absolutePath: string) {
    const thumbnailPath = yield* generateThumbnailPath(absolutePath);

    const { width, height } = yield* tryPromise({
      try: () =>
        sharp(absolutePath)
          .metadata()
          .then((metadata) => ({
            width: metadata.width ?? 0,
            height: metadata.height ?? 0,
          })),
      catch: (cause) => new ThumbnailError({ absolutePath, cause }),
    });

    const { width: thumbnailWidth, height: thumbnailHeight } =
      thumbnailDimensions(width, height);

    yield* tryPromise({
      try: () =>
        sharp(absolutePath)
          .resize(thumbnailWidth, thumbnailHeight, {
            fit: 'cover',
            position: 'center',
          })
          .webp()
          .toFile(thumbnailPath),
      catch: (cause) => new ThumbnailError({ absolutePath, cause }),
    });

    return thumbnailPath;
  }
);
