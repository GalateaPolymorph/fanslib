import { stat } from 'fs/promises';
import { basename, dirname, join } from 'path';

export type ShootInfo = {
  shootName: string;
  shootDate: Date;
  folderPath: string;
  relativePath: string;
};

export type ShootDetectionError = {
  type: 'folder_access_error' | 'invalid_pattern_error' | 'date_parse_error';
  message: string;
  folderPath: string;
};

export type ShootDetectionResult =
  | { success: true; data: ShootInfo }
  | { success: false; error: ShootDetectionError };

export type FolderAnalysisResult = {
  hasShootPattern: boolean;
  shootInfo?: ShootInfo;
  error?: ShootDetectionError;
};

/**
 * Regular expression to match YYYY-MM-DD_<NAME> folder pattern
 * Captures: year, month, day, and shoot name
 */
const SHOOT_FOLDER_PATTERN = /^(\d{4})-(\d{2})-(\d{2})_(.+)$/;

/**
 * Validates if a date is reasonable for a photo shoot
 */
const isValidShootDate = (date: Date): boolean => {
  const now = new Date();
  const minDate = new Date('1990-01-01'); // Reasonable minimum for digital photography
  const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // Up to 1 year in future

  return date >= minDate && date <= maxDate;
};

/**
 * Parses shoot information from folder name using YYYY-MM-DD_<NAME> pattern
 */
export const parseShootFromFolderName = (
  folderName: string
): {
  isShoot: boolean;
  shootInfo?: Omit<ShootInfo, 'folderPath' | 'relativePath'>;
} => {
  const match = folderName.match(SHOOT_FOLDER_PATTERN);

  if (!match) {
    return { isShoot: false };
  }

  const [, yearStr, monthStr, dayStr, shootName] = match;

  if (!yearStr || !monthStr || !dayStr || !shootName) {
    return { isShoot: false };
  }

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Validate date components
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { isShoot: false };
  }

  const shootDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor

  // Check if the date is valid and reasonable
  if (isNaN(shootDate.getTime()) || !isValidShootDate(shootDate)) {
    return { isShoot: false };
  }

  // Validate that the date components match what we parsed (handles invalid dates like Feb 30)
  if (
    shootDate.getFullYear() !== year ||
    shootDate.getMonth() !== month - 1 ||
    shootDate.getDate() !== day
  ) {
    return { isShoot: false };
  }

  return {
    isShoot: true,
    shootInfo: {
      shootName: shootName.trim(),
      shootDate,
    },
  };
};

/**
 * Detects shoot information from a folder path
 */
export const detectShootFromFolder = async (
  folderPath: string,
  contentRootPath: string
): Promise<ShootDetectionResult> => {
  try {
    const folderStat = await stat(folderPath);

    if (!folderStat.isDirectory()) {
      return {
        success: false,
        error: {
          type: 'folder_access_error',
          message: 'Path is not a directory',
          folderPath,
        },
      };
    }
  } catch {
    return {
      success: false,
      error: {
        type: 'folder_access_error',
        message: 'Folder does not exist or is not accessible',
        folderPath,
      },
    };
  }

  const folderName = basename(folderPath);
  const parseResult = parseShootFromFolderName(folderName);

  if (!parseResult.isShoot) {
    return {
      success: false,
      error: {
        type: 'invalid_pattern_error',
        message: `Folder name "${folderName}" does not match YYYY-MM-DD_<NAME> pattern`,
        folderPath,
      },
    };
  }

  if (!parseResult.shootInfo) {
    return {
      success: false,
      error: {
        type: 'date_parse_error',
        message: 'Failed to parse shoot information from folder name',
        folderPath,
      },
    };
  }

  // Calculate relative path from content root
  const relativePath = folderPath
    .replace(contentRootPath, '')
    .replace(/^\/+/, '');

  const shootInfo: ShootInfo = {
    ...parseResult.shootInfo,
    folderPath,
    relativePath,
  };

  return {
    success: true,
    data: shootInfo,
  };
};

/**
 * Analyzes a folder to determine if it matches shoot pattern
 */
export const analyzeFolderForShoot = async (
  folderPath: string,
  contentRootPath: string
): Promise<FolderAnalysisResult> => {
  const detectionResult = await detectShootFromFolder(
    folderPath,
    contentRootPath
  );

  if (detectionResult.success) {
    return {
      hasShootPattern: true,
      shootInfo: detectionResult.data,
    };
  }

  // Only return error if it's not just an invalid pattern (which is expected for non-shoot folders)
  if (detectionResult.error.type !== 'invalid_pattern_error') {
    return {
      hasShootPattern: false,
      error: detectionResult.error,
    };
  }

  return {
    hasShootPattern: false,
  };
};

/**
 * Determines if a media file belongs to a shoot based on its path
 */
export const getShootForMediaFile = async (
  mediaFilePath: string,
  contentRootPath: string
): Promise<{
  hasShoot: boolean;
  shootInfo?: ShootInfo;
  error?: ShootDetectionError;
}> => {
  const mediaDir = dirname(mediaFilePath);
  const analysisResult = await analyzeFolderForShoot(mediaDir, contentRootPath);

  if (analysisResult.hasShootPattern && analysisResult.shootInfo) {
    return {
      hasShoot: true,
      shootInfo: analysisResult.shootInfo,
    };
  }

  if (analysisResult.error) {
    return {
      hasShoot: false,
      error: analysisResult.error,
    };
  }

  return {
    hasShoot: false,
  };
};

/**
 * Scans a directory and returns all detected shoots
 */
export const scanDirectoryForShoots = async (
  directoryPath: string,
  contentRootPath: string = directoryPath
): Promise<{
  success: boolean;
  shoots: ShootInfo[];
  errors: ShootDetectionError[];
}> => {
  const shoots: ShootInfo[] = [];
  const errors: ShootDetectionError[] = [];

  try {
    const dirStat = await stat(directoryPath);
    if (!dirStat.isDirectory()) {
      errors.push({
        type: 'folder_access_error',
        message: 'Path is not a directory',
        folderPath: directoryPath,
      });
      return { success: false, shoots, errors };
    }
  } catch {
    errors.push({
      type: 'folder_access_error',
      message: 'Directory does not exist or is not accessible',
      folderPath: directoryPath,
    });
    return { success: false, shoots, errors };
  }

  try {
    const entries = await Array.fromAsync(
      new Bun.Glob('*').scan({ cwd: directoryPath, onlyFiles: false })
    );

    const folderChecks = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = join(directoryPath, entry);
        try {
          const entryStat = await stat(fullPath);
          if (entryStat.isDirectory()) {
            return analyzeFolderForShoot(fullPath, contentRootPath);
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    folderChecks.forEach((result) => {
      if (result) {
        if (result.hasShootPattern && result.shootInfo) {
          shoots.push(result.shootInfo);
        } else if (result.error) {
          errors.push(result.error);
        }
      }
    });

    return { success: true, shoots, errors };
  } catch (error) {
    errors.push({
      type: 'folder_access_error',
      message:
        error instanceof Error
          ? error.message
          : 'Unknown directory scanning error',
      folderPath: directoryPath,
    });
    return { success: false, shoots, errors };
  }
};

/**
 * Validates shoot name for database storage
 */
export const validateShootName = (
  shootName: string
): { isValid: boolean; error?: string } => {
  if (!shootName || shootName.trim().length === 0) {
    return { isValid: false, error: 'Shoot name cannot be empty' };
  }

  if (shootName.length > 255) {
    return { isValid: false, error: 'Shoot name cannot exceed 255 characters' };
  }

  // Check for invalid characters that might cause issues
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(shootName)) {
    return { isValid: false, error: 'Shoot name contains invalid characters' };
  }

  return { isValid: true };
};

/**
 * Normalizes shoot name for consistent storage
 */
export const normalizeShootName = (shootName: string): string =>
  shootName.trim().replace(/\s+/g, ' ');

/**
 * Validates if a folder name matches the shoot pattern
 */
export const isValidShootFolderName = (folderName: string): boolean => {
  const parseResult = parseShootFromFolderName(folderName);
  return parseResult.isShoot;
};
