import { app } from "electron";
import { existsSync } from "fs";
import { copyFile, mkdir, access } from "fs/promises";
import { join, dirname } from "path";
import { db, uninitialize } from "../../lib/db";
import { Media } from "../library/entity";
import { convertRelativeToAbsolute } from "../library/path-utils";
import { DatabaseImportResult, ValidationResult } from "./api-type";

const dbPath = join(app.getPath("userData"), "fanslib.sqlite");
const backupPath = join(app.getPath("userData"), "fanslib.sqlite.backup");

export const backupCurrentDatabase = async (): Promise<void> => {
  if (existsSync(dbPath)) {
    await copyFile(dbPath, backupPath);
  }
};

export const importDatabase = async (sourcePath: string): Promise<DatabaseImportResult> => {
  try {
    // Validate source file exists
    if (!existsSync(sourcePath)) {
      return { success: false, error: "Source database file does not exist" };
    }

    // Backup current database if it exists
    await backupCurrentDatabase();

    // Close current database connection
    await uninitialize();

    // Ensure userData directory exists
    await mkdir(dirname(dbPath), { recursive: true });

    // Copy the source file to the app's database location
    await copyFile(sourcePath, dbPath);

    // Initialize the new database
    await db();

    return { success: true };
  } catch (error) {
    console.error("Error importing database:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

export const validateImportedDatabase = async (libraryPath: string): Promise<ValidationResult> => {
  try {
    const database = await db();
    const mediaRepository = database.getRepository(Media);
    
    // Get all media files from the database
    const allMedia = await mediaRepository.find();
    
    let validFiles = 0;
    const missingFiles: string[] = [];
    
    // Check each media file
    for (const media of allMedia) {
      try {
        const absolutePath = convertRelativeToAbsolute(media.relativePath, libraryPath);
        await access(absolutePath);
        validFiles++;
      } catch {
        missingFiles.push(media.relativePath);
      }
    }
    
    return {
      totalFiles: allMedia.length,
      missingFiles,
      validFiles
    };
  } catch (error) {
    console.error("Error validating imported database:", error);
    return {
      totalFiles: 0,
      missingFiles: [],
      validFiles: 0
    };
  }
};