import { promises as fs, Stats } from "fs";
import path from "path";
import { db } from "../../lib/db";
import { getVideoDuration } from "../../lib/video";
import { walkDirectory } from "../../lib/walkDirectory";
import { FileScanResult, LibraryScanResult } from "./api-type";
import { Media } from "./entity";
import { createMedia, deleteMedia, fetchMediaByPath, updateMedia } from "./operations";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".avi", ".mkv"]);

/**
 * Try to find a media entry that matches the given file stats
 * This helps identify renamed files by matching size and creation time
 */
const findMediaByStats = async (stats: Stats) => {
  return (await db()).getRepository(Media).findOne({
    where: {
      size: stats.size,
      fileCreationDate: stats.ctime,
    },
  });
};

/**
 * Determine if a file is a supported media type
 */
function isMediaFile(filePath: string): { isSupported: boolean; type: "image" | "video" | null } {
  const ext = path.extname(filePath).toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) {
    return { isSupported: true, type: "image" };
  }
  if (VIDEO_EXTENSIONS.has(ext)) {
    return { isSupported: true, type: "video" };
  }
  return { isSupported: false, type: null };
}

/**
 * Scan a single file and create/update its media entry
 */
export async function scanFile(filePath: string): Promise<FileScanResult> {
  const { isSupported, type } = isMediaFile(filePath);
  if (!isSupported || !type) {
    throw new Error(`Unsupported file type: ${filePath}`);
  }

  const stats = await fs.stat(filePath);
  let existingMedia = await fetchMediaByPath(filePath);

  if (!existingMedia) {
    existingMedia = await findMediaByStats(stats);
  }

  let duration: number | undefined;
  if (type === "video") {
    duration = await getVideoDuration(filePath);
    console.log(duration);
  }

  const media: Omit<Media, "id" | "createdAt" | "updatedAt"> = {
    path: filePath,
    type,
    name: path.basename(filePath),
    size: stats.size,
    fileCreationDate: stats.birthtime,
    fileModificationDate: stats.mtime,
    categories: existingMedia?.categories || [],
    postMedia: existingMedia?.postMedia || [],
    duration,
  };

  if (!existingMedia) {
    const newMedia = await createMedia(media);
    return { action: "added", media: newMedia };
  }

  // Check if file needs update
  const needsUpdate =
    existingMedia.path !== filePath || // Path changed (renamed)
    existingMedia.fileModificationDate !== media.fileModificationDate || // Content changed
    existingMedia.size !== media.size || // Size changed
    (type === "video" && existingMedia.duration !== media.duration); // Duration changed

  if (needsUpdate) {
    const updatedMedia = await updateMedia(existingMedia.id, {
      ...existingMedia,
      path: filePath,
      name: media.name,
      fileModificationDate: media.fileModificationDate,
      size: media.size,
      duration: media.duration,
    });
    return { action: "updated", media: updatedMedia };
  }

  return { action: "unchanged", media: existingMedia };
}

/**
 * Scan the entire library directory
 */
export async function scanLibrary(libraryPath: string): Promise<LibraryScanResult> {
  const processedPaths = new Set<string>();
  const result: LibraryScanResult = {
    added: 0,
    updated: 0,
    removed: 0,
    total: 0,
  };

  // Get all existing media from database
  const database = await db();
  const existingMedia = await database.getRepository(Media).find();

  // Walk through directory and process files
  for await (const filePath of walkDirectory(libraryPath)) {
    processedPaths.add(filePath);

    try {
      const { isSupported } = isMediaFile(filePath);
      if (!isSupported) continue;

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
  }

  // Remove files that no longer exist
  for (const media of existingMedia) {
    if (!processedPaths.has(media.path)) {
      await deleteMedia(media.id);
      result.removed++;
    }
  }

  result.total = existingMedia.length - result.removed + result.added;

  return result;
}
