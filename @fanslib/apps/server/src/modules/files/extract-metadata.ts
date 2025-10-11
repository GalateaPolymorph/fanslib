import { Data, Effect } from 'effect';
import { relative, resolve } from 'path';
import { fileStats } from './file-stats';
import { getMimeTypeFromExtension, isSupportedFormat } from './formats';
import { hashFile } from './hash';

export class FileNotSupportedError extends Data.TaggedError(
  'FileNotSupportedError'
)<{}> {}

export type FileMetadata = {
  absolutePath: string;
  fileName: string;
  fileSize: number;
  createdAt: Date;
  modifiedAt: Date;
  contentHash: string;
  mimeType: string;
  relativePath: string;
};

export const extractFileMetadata = Effect.fn('extractFileMetadata')(function* (
  mediaRoot: string,
  filePath: string
) {
  const isSupported = isSupportedFormat(filePath);
  if (!isSupported) return yield* new FileNotSupportedError();

  const absoluteFilePath = resolve(filePath);
  const absoluteContentRoot = resolve(mediaRoot);
  const relativePath = relative(absoluteContentRoot, absoluteFilePath);

  const stats = yield* fileStats(filePath);

  const metadata: FileMetadata = {
    absolutePath: filePath,
    fileName: filePath.split('/').pop() ?? '',
    fileSize: stats.size,
    createdAt: stats.birthtime || stats.mtime,
    modifiedAt: stats.mtime,
    contentHash: yield* hashFile(filePath),
    mimeType: getMimeTypeFromExtension(filePath),
    relativePath,
  };

  return metadata;
});
