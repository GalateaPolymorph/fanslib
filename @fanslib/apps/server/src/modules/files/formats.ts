import { Data } from 'effect';
import { match } from 'effect/Effect';
import { extname } from 'path';
import { fileExists } from './file-exists';

const SUPPORTED_IMAGES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

const SUPPORTED_VIDEOS = {
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
} as const;

const SUPPORTED_FORMATS = {
  ...SUPPORTED_IMAGES,
  ...SUPPORTED_VIDEOS,
} as const;

export const isSupportedFormat = (filePath: string): boolean => {
  const extension = extname(filePath).toLowerCase();
  if (!extension) return false;
  return extension in SUPPORTED_FORMATS;
};

export class UnsupportedFormatError extends Data.TaggedError(
  'UnsupportedFormatError'
)<{ absolutePath: string }> {}

export const isFileSupported = (filePath: string) =>
  fileExists(filePath).pipe(
    match({
      onFailure: () => false,
      onSuccess: () => isSupportedFormat(filePath),
    })
  );

export const isImageFile = (filePath: string): boolean => {
  const ext = extname(filePath).toLowerCase();
  return Object.keys(SUPPORTED_IMAGES).includes(ext);
};

export const isVideoFile = (filePath: string): boolean => {
  const ext = extname(filePath).toLowerCase();
  return Object.keys(SUPPORTED_VIDEOS).includes(ext);
};

export const getMimeTypeFromExtension = (filePath: string): string => {
  const extension = filePath.toLowerCase().split('.').pop();
  if (!extension) return 'application/octet-stream';

  const fullExtension = `.${extension}` as keyof typeof SUPPORTED_FORMATS;
  return SUPPORTED_FORMATS[fullExtension] || 'application/octet-stream';
};
