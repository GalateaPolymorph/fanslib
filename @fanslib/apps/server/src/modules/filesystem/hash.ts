import type { BunFile } from 'bun';
import { createHash } from 'crypto';

export type HashError = {
  type: 'file_read_error' | 'hash_generation_error';
  message: string;
  filePath: string;
};

export type HashResult =
  | { success: true; data: string }
  | { success: false; error: HashError };

/**
 * Generates SHA-256 hash from file content for change detection
 */
export const generateFileHash = async (
  filePath: string
): Promise<HashResult> => {
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    return {
      success: false,
      error: {
        type: 'file_read_error',
        message: 'File does not exist',
        filePath,
      },
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const hash = createHash('sha256');
    hash.update(new Uint8Array(arrayBuffer));
    return {
      success: true,
      data: hash.digest('hex'),
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'hash_generation_error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown hash generation error',
        filePath,
      },
    };
  }
};

/**
 * Generates hash from Bun file object for change detection
 */
export const generateBunFileHash = async (
  file: BunFile
): Promise<HashResult> => {
  if (!(await file.exists())) {
    return {
      success: false,
      error: {
        type: 'file_read_error',
        message: 'File does not exist',
        filePath: file.name ?? 'unknown',
      },
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const hash = createHash('sha256');
    hash.update(new Uint8Array(arrayBuffer));
    return {
      success: true,
      data: hash.digest('hex'),
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'hash_generation_error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown hash generation error',
        filePath: file.name ?? 'unknown',
      },
    };
  }
};

/**
 * Compares two file hashes to detect changes
 */
export const hasFileChanged = (
  previousHash: string,
  currentHash: string
): boolean => previousHash !== currentHash;
