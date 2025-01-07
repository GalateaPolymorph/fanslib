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
import { generateThumbnail, thumbnailExists } from "./thumbnail";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".avi", ".mkv"]);

/**
 * Try to find a media entry that matches the given file stats
 * This helps identify renamed files by matching size and creation time
 */
const findMediaByStats = async (stats: Stats) => {
  console.log("trying to find media by stats", stats);

  const media = await (await db()).getRepository(Media).findOne({
    where: {
      size: stats.size,
      fileCreationDate: stats.birthtime,
    },
  });
  console.log("found media by stats", media);
  return media;
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
      categories: existingMedia?.categories || [],
      postMedia: existingMedia?.postMedia || [],
      shoots: [],
      duration: type === "video" ? await getVideoDuration(filePath) : undefined,
    };
    const newMedia = await createMedia(media);
    // Generate thumbnail for new media
    try {
      await generateThumbnail(filePath, newMedia.id, type);
    } catch (error) {
      console.error(`Failed to generate thumbnail for ${filePath}:`, error);
    }
    return { action: "added", media: newMedia };
  }

  const needsUpdate =
    existingMedia.path !== filePath ||
    !isSameSecond(stats.mtime, existingMedia.fileModificationDate) ||
    existingMedia.size !== stats.size ||
    !(await thumbnailExists(existingMedia.id));

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

  // Generate or update thumbnail if needed
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

      const result: LibraryScanResult = {
        added: 0,
        updated: 0,
        removed: 0,
        total: 0,
      };

      // Second pass: process files
      for (let i = 0; i < filesToProcess.length; i++) {
        const filePath = filesToProcess[i];
        processedPaths.add(filePath);

        try {
          const scanResult = await scanFile(filePath);
          switch (scanResult.action) {
            case "added":
              result.added++;
              break;
            case "updated":
              result.updated++;
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

      // Cleanup: remove files that no longer exist
      for (const media of existingMedia) {
        if (!processedPaths.has(media.path)) {
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
