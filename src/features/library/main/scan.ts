import { promises as fs } from "fs";
import path from "path";
import type { MediaFile } from "../shared/types";

// Supported file extensions
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".avi", ".mkv"]);

async function* walkDirectory(dir: string): AsyncGenerator<string> {
  if (!dir || dir.trim() === "") {
    return;
  }

  try {
    const normalizedPath = path.resolve(dir);

    // Check if directory exists and is accessible
    const accessible = await fs
      .access(normalizedPath)
      .then(() => true)
      .catch(() => false);
    if (!accessible) {
      return;
    }

    // Verify it's a directory
    const stats = await fs.stat(normalizedPath);
    if (!stats.isDirectory()) {
      console.warn(`Path is not a directory: ${normalizedPath}`);
      return;
    }

    const entries = await fs.readdir(normalizedPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(normalizedPath, entry.name);

      if (entry.isDirectory()) {
        yield* walkDirectory(fullPath);
      } else if (entry.isFile()) {
        yield fullPath;
      }
    }
  } catch (error) {
    console.error(`Unexpected error walking directory ${dir}:`, error);
    // Rethrow unexpected errors
    throw error;
  }
}

export async function scanLibraryForMediaFiles(libraryPath: string): Promise<MediaFile[]> {
  const mediaFiles: MediaFile[] = [];

  try {
    for await (const filePath of walkDirectory(libraryPath)) {
      const ext = path.extname(filePath).toLowerCase();

      // Check if file extension matches supported formats
      const isImage = IMAGE_EXTENSIONS.has(ext);
      const isVideo = VIDEO_EXTENSIONS.has(ext);

      if (!isImage && !isVideo) continue;

      // Get file stats
      const stats = await fs.stat(filePath);

      mediaFiles.push({
        path: filePath,
        type: isImage ? "image" : "video",
        name: path.basename(filePath),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      });
    }

    return mediaFiles;
  } catch (error) {
    console.error("Error scanning library:", error);
    return [];
  }
}
