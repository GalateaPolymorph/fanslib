import { Data, Effect } from 'effect';
import { tryPromise } from 'effect/Effect';
import sharp from 'sharp';

export type ImageMetadata = {
  width: number;
  height: number;
  format: string;
  hasAlpha: boolean;
  density?: number | undefined;
};

export class ImageMetadataError extends Data.TaggedError('ImageMetadataError')<{
  absolutePath: string;
  cause: Error;
}> {}

export const extractImageMetadata = Effect.fn('extractImageMetadata')(
  function* (absolutePath: string) {
    const metadata = yield* tryPromise({
      try: () => sharp(absolutePath).metadata(),
      catch: (error) =>
        new ImageMetadataError({
          absolutePath,
          cause: error as Error,
        }),
    });

    if (!metadata.width || !metadata.height) {
      return yield* Effect.fail(
        new ImageMetadataError({
          absolutePath,
          cause: new Error('Could not extract image dimensions'),
        })
      );
    }

    const out: ImageMetadata = {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format ?? 'unknown',
      hasAlpha: metadata.hasAlpha ?? false,
      density: metadata.density,
    };

    return out;
  }
);
