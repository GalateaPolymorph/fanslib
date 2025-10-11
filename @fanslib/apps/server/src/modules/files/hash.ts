import { createHash } from 'crypto';
import { Data, pipe } from 'effect';
import { flatMap, tryPromise } from 'effect/Effect';
import { fileExists } from './file-exists';

export class HashFileError extends Data.TaggedError('HashFileError')<{}> {}

export const hashFile = (filePath: string) =>
  pipe(
    fileExists(filePath),
    flatMap(() =>
      tryPromise({
        try: async () => {
          const file = Bun.file(filePath);
          const arrayBuffer = await file.arrayBuffer();
          const hash = createHash('sha256');
          hash.update(new Uint8Array(arrayBuffer));
          return hash.digest('hex');
        },
        catch: () => new HashFileError(),
      })
    )
  );
