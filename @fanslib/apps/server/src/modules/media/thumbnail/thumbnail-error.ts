import { Data } from 'effect';

export class ThumbnailError extends Data.TaggedError('ThumbnailError')<{
  absolutePath: string;
  cause: unknown;
}> {}
