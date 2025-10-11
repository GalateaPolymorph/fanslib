import { Data, pipe } from 'effect';
import { andThen, tryPromise } from 'effect/Effect';
import { fileExists } from './file-exists';

export class FileAccessError extends Data.TaggedError('FileAccessError')<{}> {}

export const fileStats = (filePath: string) =>
  pipe(
    fileExists(filePath),
    andThen(() =>
      tryPromise({
        try: () => Bun.file(filePath).stat(),
        catch: () => new FileAccessError(),
      })
    )
  );
