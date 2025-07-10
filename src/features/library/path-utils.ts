import * as path from "path";
import * as fs from "fs/promises";
import { db } from "../../lib/db";
import { Media } from "./entity";

export type ValidationResult = {
  readonly type: "error" | "warning";
  readonly message: string;
  readonly mediaId?: string;
  readonly path?: string;
};

export type PathMigrationResult = {
  readonly success: boolean;
  readonly migratedCount: number;
  readonly errors: ValidationResult[];
};

// Convert absolute path to relative path using library path
export const convertAbsoluteToRelative = (absolutePath: string, libraryPath: string): string => {
  if (!path.isAbsolute(absolutePath)) {
    return absolutePath;
  }
  
  if (!absolutePath.startsWith(libraryPath)) {
    throw new Error(`Path ${absolutePath} is not within library path ${libraryPath}`);
  }
  
  return path.relative(libraryPath, absolutePath);
};

// Convert relative path to absolute path using library path  
export const convertRelativeToAbsolute = (relativePath: string, libraryPath: string): string => {
  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }
  
  return path.join(libraryPath, relativePath);
};

// Resolve media path using relativePath first, fallback to path
export const resolveMediaPath = (media: Media, libraryPath: string): string => {
  if (media.relativePath) {
    return convertRelativeToAbsolute(media.relativePath, libraryPath);
  }
  
  // Fallback to absolute path
  return media.path;
};

// Validate that a media file exists at the resolved path
export const validateMediaExists = async (media: Media, libraryPath: string): Promise<boolean> => {
  try {
    const resolvedPath = resolveMediaPath(media, libraryPath);
    const stats = await fs.stat(resolvedPath);
    return stats.isFile();
  } catch {
    return false;
  }
};

// Validate library path exists and is accessible
export const validateLibraryPath = async (libraryPath: string): Promise<boolean> => {
  try {
    const stats = await fs.stat(libraryPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

// Migrate all media records to use relative paths
export const migrateMediaToRelativePaths = async (libraryPath: string): Promise<PathMigrationResult> => {
  const database = await db();
  const mediaRepository = database.getRepository(Media);
  
  const results: ValidationResult[] = [];
  let migratedCount = 0;
  
  try {
    // Get all media records that don't have relativePath set
    const mediaRecords = await mediaRepository.find({
      where: { relativePath: null },
    });
    
    for (const media of mediaRecords) {
      try {
        const relativePath = convertAbsoluteToRelative(media.path, libraryPath);
        
        // Validate the file exists at the resolved path
        const exists = await validateMediaExists({ ...media, relativePath }, libraryPath);
        
        if (!exists) {
          results.push({
            type: "warning",
            message: `File not found at resolved path`,
            mediaId: media.id,
            path: media.path,
          });
          continue;
        }
        
        // Update the media record
        await mediaRepository.update(media.id, { relativePath });
        migratedCount++;
        
      } catch (error) {
        results.push({
          type: "error",
          message: `Failed to migrate path: ${error instanceof Error ? error.message : String(error)}`,
          mediaId: media.id,
          path: media.path,
        });
      }
    }
    
    return {
      success: true,
      migratedCount,
      errors: results,
    };
    
  } catch (error) {
    return {
      success: false,
      migratedCount,
      errors: [
        ...results,
        {
          type: "error",
          message: `Migration failed: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
};

// Validate migration results
export const validateMigration = async (libraryPath: string): Promise<ValidationResult[]> => {
  const database = await db();
  const mediaRepository = database.getRepository(Media);
  
  const results: ValidationResult[] = [];
  
  try {
    // Get all media records
    const mediaRecords = await mediaRepository.find();
    
    for (const media of mediaRecords) {
      // Check if relativePath is set
      if (!media.relativePath) {
        results.push({
          type: "warning",
          message: "Media record has no relativePath set",
          mediaId: media.id,
          path: media.path,
        });
        continue;
      }
      
      // Validate the file exists at the resolved path
      const exists = await validateMediaExists(media, libraryPath);
      
      if (!exists) {
        results.push({
          type: "error",
          message: "File not found at resolved path",
          mediaId: media.id,
          path: resolveMediaPath(media, libraryPath),
        });
      }
    }
    
  } catch (error) {
    results.push({
      type: "error",
      message: `Validation failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
  
  return results;
};