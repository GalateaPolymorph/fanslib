import { Data } from 'effect';
import { tryPromise } from 'effect/Effect';

export class DirectoryDoesNotExistError extends Data.TaggedError(
  'DirectoryDoesNotExistError'
)<{
  readonly path: string;
}> {}

export const directoryExists = (directoryPath: string) =>
  tryPromise({
    try: async () => {
      const file = Bun.file(directoryPath);
      const stat = await file.stat();
      if (!stat.isDirectory()) {
        throw new Error('Path is not a directory');
      }
      return directoryPath;
    },
    catch: () =>
      new DirectoryDoesNotExistError({
        path: directoryPath,
      }),
  });
