import { Config, Effect } from 'effect';
import { basename, extname, join } from 'path';

export const generateThumbnailPath = Effect.fn(function* (
  absolutePath: string
) {
  const thumbnailRoot = yield* Config.string('THUMBNAIL_ROOT');

  const originalName = basename(absolutePath, extname(absolutePath));
  const thumbnailName = `${originalName}_thumbnail.jpg`;
  return join(thumbnailRoot, thumbnailName);
});
