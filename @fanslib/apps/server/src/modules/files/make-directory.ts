import { mkdir } from 'fs/promises';
import { Data } from 'effect';
import { tryPromise } from 'effect/Effect';

export class DirectoryCreationError extends Data.TaggedError(
  'DirectoryCreationError'
)<{
  readonly path: string;
  readonly cause: unknown;
}> {}

export const makeDirectory = (directoryPath: string) =>
  tryPromise({
    try: async () => {
      await mkdir(directoryPath, { recursive: true });
      return directoryPath;
    },
    catch: (error) =>
      new DirectoryCreationError({
        path: directoryPath,
        cause: error,
      }),
  });
