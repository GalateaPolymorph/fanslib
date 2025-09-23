import type { BunFile } from 'bun';
import { stat } from 'fs/promises';
import { glob } from 'glob';
import { relative, resolve } from 'path';
import { generateFileHash } from './hash.js';

export type MediaFileInfo = {
  filePath: string;
  fileName: string;
  fileSize: number;
  createdAt: Date;
  modifiedAt: Date;
  contentHash: string;
  mimeType: string;
  isValid: boolean;
  relativePath: string;
};

export type ScanError = {
  type:
    | 'directory_access_error'
    | 'file_validation_error'
    | 'hash_generation_error';
  message: string;
  filePath?: string;
};

export type ScanResult =
  | { success: true; data: MediaFileInfo[] }
  | { success: false; error: ScanError };

/**
 * Supported media format extensions and their MIME types
 */
const SUPPORTED_FORMATS = {
  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  // Videos
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
} as const;

/**
 * Checks if file extension is supported
 */
const isSupportedFormat = (filePath: string): boolean => {
  const extension = filePath.toLowerCase().split('.').pop();
  return extension ? `.${extension}` in SUPPORTED_FORMATS : false;
};

/**
 * Gets MIME type based on file extension
 */
const getMimeTypeFromExtension = (filePath: string): string => {
  const extension = filePath.toLowerCase().split('.').pop();
  if (!extension) return 'application/octet-stream';

  const fullExtension = `.${extension}` as keyof typeof SUPPORTED_FORMATS;
  return SUPPORTED_FORMATS[fullExtension] || 'application/octet-stream';
};

/**
 * Validates file integrity and format
 */
const validateMediaFile = async (file: BunFile): Promise<boolean> => {
  try {
    if (!(await file.exists())) {
      return false;
    }

    // Check file size (must be > 0)
    const stats = await file.stat();
    if (stats.size === 0) {
      return false;
    }

    // Basic MIME type validation by reading file header
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check for common file signatures
    if (bytes.length < 4) return false;

    // If no specific signature found, assume valid for now
    // More sophisticated validation can be added later
    return true;
  } catch {
    return false;
  }
};

/**
 * Extracts file metadata using Bun's file system APIs
 */
const extractFileMetadata = async (
  filePath: string,
  contentRootPath: string
): Promise<
  { success: true; data: MediaFileInfo } | { success: false; error: ScanError }
> => {
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    return {
      success: false,
      error: {
        type: 'file_validation_error',
        message: 'File does not exist',
        filePath,
      },
    };
  }

  try {
    const stats = await file.stat();
    const hashResult = await generateFileHash(filePath);

    if (!hashResult.success) {
      return {
        success: false,
        error: {
          type: 'hash_generation_error',
          message: hashResult.error.message,
          filePath,
        },
      };
    }

    const isValid = await validateMediaFile(file);
    const fileName = filePath.split('/').pop() ?? '';

    // Normalize paths to absolute for proper relative calculation
    const absoluteFilePath = resolve(filePath);
    const absoluteContentRoot = resolve(contentRootPath);
    const relativePath = relative(absoluteContentRoot, absoluteFilePath);

    const mimeType = getMimeTypeFromExtension(filePath);

    const mediaFileInfo: MediaFileInfo = {
      filePath,
      fileName,
      fileSize: stats.size,
      createdAt: stats.birthtime || stats.mtime,
      modifiedAt: stats.mtime,
      contentHash: hashResult.data,
      mimeType,
      isValid,
      relativePath,
    };

    return {
      success: true,
      data: mediaFileInfo,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'file_validation_error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown file validation error',
        filePath,
      },
    };
  }
};

/**
 * Scans directory recursively for supported media files
 */
export const scanDirectory = async (
  directoryPath: string
): Promise<ScanResult> => {
  // Verify directory exists and is accessible
  try {
    const dirStat = await stat(directoryPath);
    if (!dirStat.isDirectory()) {
      return {
        success: false,
        error: {
          type: 'directory_access_error',
          message: 'Path is not a directory',
          filePath: directoryPath,
        },
      };
    }
  } catch {
    return {
      success: false,
      error: {
        type: 'directory_access_error',
        message: 'Directory does not exist or is not accessible',
        filePath: directoryPath,
      },
    };
  }

  try {
    // Use glob to find all files recursively
    const globPattern = `${directoryPath}/**/*`;
    const allFiles = await glob(globPattern, { withFileTypes: false });

    // Filter out directories manually since nodir option doesn't exist in new glob
    const files = await Promise.all(
      allFiles.map(async (filePath) => {
        try {
          const file = Bun.file(filePath);
          const stat = await file.stat();
          return !stat.isDirectory() ? filePath : null;
        } catch {
          // Skip files that can't be accessed
          return null;
        }
      })
    ).then((results) =>
      results.filter((file): file is string => file !== null)
    );
    const mediaFiles = files.filter(isSupportedFormat);

    // Process each file and extract metadata
    const mediaFileInfoResults = await Promise.all(
      mediaFiles.map((filePath) => extractFileMetadata(filePath, directoryPath))
    );

    // Separate successful results from errors
    const successfulFiles: MediaFileInfo[] = [];
    const errors: ScanError[] = [];

    mediaFileInfoResults.forEach((result) => {
      if (result.success) {
        successfulFiles.push(result.data);
      } else {
        errors.push(result.error);
      }
    });

    // If we have any successful files, return them
    // Even if some files failed, we want to return the successful ones
    if (successfulFiles.length > 0 || errors.length === 0) {
      return {
        success: true,
        data: successfulFiles,
      };
    }

    // If all files failed, return the first error
    return {
      success: false,
      error: errors[0] ?? {
        type: 'directory_access_error',
        message: 'No media files found or all files failed validation',
        filePath: directoryPath,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'directory_access_error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown directory scanning error',
        filePath: directoryPath,
      },
    };
  }
};

/**
 * Gets all supported file extensions
 */
export const getSupportedExtensions = (): string[] =>
  Object.keys(SUPPORTED_FORMATS);

/**
 * Checks if a file path has a supported media format
 */
export const isMediaFile = (filePath: string): boolean =>
  isSupportedFormat(filePath);

/**
 * Gets MIME type for a file path
 */
export const getFileMimeType = (filePath: string): string =>
  getMimeTypeFromExtension(filePath);
