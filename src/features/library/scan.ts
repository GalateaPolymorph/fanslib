import { isSameSecond } from "date-fns";
import { BrowserWindow } from "electron";
import { promises as fs, Stats } from "fs";
import path from "path";
import { db } from "../../lib/db";
import { getVideoDuration } from "../../lib/video";
import { walkDirectory } from "../../lib/walkDirectory";
import { FileScanResult, LibraryScanProgress, LibraryScanResult } from "./api-type";
import { Media } from "./entity";
import { createMedia, deleteMedia, fetchMediaByPath, updateMedia } from "./operations";
import { resolveMediaPath } from "./path-utils";
import { generateThumbnail, thumbnailExists } from "./thumbnail";
import { repairUppercaseExtension } from "./uppercase-extensions";
import { loadSettings } from "../settings/load";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".avi", ".mkv"]);

/**
 * Try to find a media entry that matches the given file stats
 * This helps identify renamed files by matching size and creation time
 * Only considers it a match if the original file no longer exists at its old location
 */
const findMediaByStats = async (stats: Stats) => {
  // Find all media with matching size and creation date
  const mediaRepo = (await db()).getRepository(Media);
  const potentialMatches = await mediaRepo.find({
    where: {
      size: stats.size,
      fileCreationDate: stats.birthtime,
    },
  });

  // Check each potential match
  for (const media of potentialMatches) {
    try {
      // Check if the original file still exists using path resolution
      try {
        const settings = await loadSettings();
        const resolvedPath = resolveMediaPath(media, settings.libraryPath);
        await fs.access(resolvedPath);
        // If we can access the file, it still exists, so this is not our moved file
        continue;
      } catch {
        // File doesn't exist at original location, this is probably our moved file
        return media;
      }
    } catch (error) {
      console.error(`Failed to process potential match ${media.path}:`, error);
    }
  }

  return null;
};

/**
 * Determine if a file is a supported media type
 */
const isMediaFile = (
  filePath: string
): { isSupported: boolean; type: "image" | "video" | null } => {
  const ext = path.extname(filePath).toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) {
    return { isSupported: true, type: "image" };
  }
  if (VIDEO_EXTENSIONS.has(ext)) {
    return { isSupported: true, type: "video" };
  }
  return { isSupported: false, type: null };
};

/**
 * Scan a single file and create/update its media entry
 */
export const scanFile = async (filePath: string): Promise<FileScanResult> => {
  const { isSupported, type } = isMediaFile(filePath);

  if (!isSupported || !type) {
    throw new Error(`Unsupported file type: ${filePath}`);
  }

  const stats = await fs.stat(filePath);
  let existingMedia = await fetchMediaByPath(filePath);

  if (!existingMedia) {
    existingMedia = await findMediaByStats(stats);
  }

  if (!existingMedia) {
    const media: Omit<Media, "id" | "createdAt" | "updatedAt"> = {
      path: filePath,
      type,
      name: path.basename(filePath),
      size: stats.size,
      fileCreationDate: stats.birthtime,
      fileModificationDate: stats.mtime,
      postMedia: existingMedia?.postMedia || [],
      shoots: [],
      duration: type === "video" ? await getVideoDuration(filePath) : undefined,
      mediaTags: [],
    };

    const newMedia = await createMedia(media);

    try {
      await generateThumbnail(filePath, newMedia.id, type);
    } catch (error) {
      console.error(`Failed to generate thumbnail for ${filePath}:`, error);
    }
    return { action: "added", media: newMedia };
  }

  const hasThumbnail = await thumbnailExists(existingMedia.id);

  const needsUpdate =
    existingMedia.path !== filePath ||
    !isSameSecond(stats.mtime, existingMedia.fileModificationDate) ||
    existingMedia.size !== stats.size ||
    !hasThumbnail;

  if (!needsUpdate) {
    return { action: "unchanged", media: existingMedia };
  }

  const updatedMedia = await updateMedia(existingMedia.id, {
    ...existingMedia,
    path: filePath,
    name: path.basename(filePath),
    fileModificationDate: stats.mtime,
    size: stats.size,
    duration: type === "video" ? await getVideoDuration(filePath) : undefined,
  });

  try {
    await generateThumbnail(filePath, updatedMedia.id, type);
  } catch (error) {
    console.error(`Failed to generate thumbnail for ${filePath}:`, error);
  }

  return { action: "updated", media: updatedMedia };
};

class LibraryScanner {
  private static instance: LibraryScanner;
  private isScanning: boolean = false;

  public static getInstance(): LibraryScanner {
    if (!LibraryScanner.instance) {
      LibraryScanner.instance = new LibraryScanner();
    }
    return LibraryScanner.instance;
  }

  public isCurrentlyScanning(): boolean {
    return this.isScanning;
  }

  public onProgress(progress: LibraryScanProgress): void {
    if (BrowserWindow.getAllWindows().length <= 0) return;
    const win = BrowserWindow.getAllWindows()[0];
    win.webContents.send("library:scanprogress", progress);
  }

  public onComplete(result: LibraryScanResult): void {
    if (BrowserWindow.getAllWindows().length <= 0) return;
    const win = BrowserWindow.getAllWindows()[0];
    win.webContents.send("library:scancomplete", result);
  }

  public async startScan(libraryPath: string): Promise<void> {
    if (this.isScanning) {
      throw new Error("Scan already in progress");
    }

    this.isScanning = true;

    try {
      // First pass: collect all files
      const filesToProcess: string[] = [];
      for await (const filePath of walkDirectory(libraryPath)) {
        const { isSupported } = isMediaFile(filePath);
        if (isSupported) {
          filesToProcess.push(filePath);
        }
      }

      // Get existing media for cleanup
      const database = await db();
      const existingMedia = await database.getRepository(Media).find();
      const processedPaths = new Set<string>();
      const processedMediaIds = new Set<string>(); // Track which media entries we've processed

      const result: LibraryScanResult = {
        added: 0,
        updated: 0,
        removed: 0,
        total: 0,
      };

      // Second pass: process files
      for (let i = 0; i < filesToProcess.length; i++) {
        const filePath = await repairUppercaseExtension(filesToProcess[i]);
        processedPaths.add(filePath);

        try {
          const scanResult = await scanFile(filePath);
          switch (scanResult.action) {
            case "added":
              result.added++;
              processedMediaIds.add(scanResult.media.id);
              break;
            case "updated":
              result.updated++;
              processedMediaIds.add(scanResult.media.id);
              break;
            case "unchanged":
              processedMediaIds.add(scanResult.media.id);
              break;
          }
        } catch (error) {
          console.error(`Failed to scan file ${filePath}:`, error);
        }

        // Emit progress
        this.onProgress({
          current: i + 1,
          total: filesToProcess.length,
        });
      }

      // Cleanup: remove files that no longer exist and weren't processed
      const settings = await loadSettings();
      for (const media of existingMedia) {
        // Skip if we've already processed this media (it was moved)
        if (processedMediaIds.has(media.id)) {
          continue;
        }

        // Check if the file still exists using path resolution
        try {
          const resolvedPath = resolveMediaPath(media, settings.libraryPath);
          await fs.access(resolvedPath);
          // File exists, keep it
          continue;
        } catch {
          // File doesn't exist and wasn't processed (moved) - delete it
          await deleteMedia(media.id);
          result.removed++;
        }
      }

      result.total = existingMedia.length - result.removed + result.added;
      this.onComplete(result);
    } finally {
      this.isScanning = false;
    }
  }
}

/**
 * Scan the entire library directory
 */
export const scanLibrary = async (libraryPath: string): Promise<LibraryScanResult> => {
  const scanner = LibraryScanner.getInstance();

  // Start the scan process asynchronously
  scanner.startScan(libraryPath).catch((error) => {
    console.error("Library scan failed:", error);
  });

  // Return immediately with empty result - frontend will be notified of progress via events
  return {
    added: 0,
    updated: 0,
    removed: 0,
    total: 0,
  };
};

export { LibraryScanner };
