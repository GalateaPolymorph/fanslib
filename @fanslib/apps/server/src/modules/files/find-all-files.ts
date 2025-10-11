import { Data } from 'effect';
import { tryPromise } from 'effect/Effect';
import { glob } from 'glob';

export class DirectoryScanError extends Data.TaggedError('DirectoryScanError')<{
  readonly path: string;
  readonly message: string;
}> {}

export const findAllFiles = (directoryPath: string) =>
  tryPromise({
    try: () => glob(`${directoryPath}/**/*`, { withFileTypes: false }),
    catch: () =>
      new DirectoryScanError({
        path: directoryPath,
        message: 'Failed to scan directory',
      }),
  });
