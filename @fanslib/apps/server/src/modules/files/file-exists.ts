import { Data } from 'effect';
import { tryPromise } from 'effect/Effect';

export class FileDoesNotExistError extends Data.TaggedError(
  'FileDoesNotExistError'
)<{}> {}

export const fileExists = (filePath: string) =>
  tryPromise({
    try: () => Bun.file(filePath).exists(),
    catch: () => new FileDoesNotExistError(),
  });
