import { promises as fs, Stats } from "fs";
import path from "path";
import { mediaDb } from "../../../lib/database/media/base";
import { createMedia } from "../../../lib/database/media/create";
import { deleteMedia } from "../../../lib/database/media/delete";
import { enrichMedia } from "../../../lib/database/media/enrich";
import { Media } from "../../../lib/database/media/type";
import { updateMedia } from "../../../lib/database/media/update";

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

/**
 * Try to find a media entry that matches the given file stats
 * This helps identify renamed files by matching size and creation time
 */
async function findMediaByStats(
  database: any,
  stats: Stats,
  currentPath: string
): Promise<Media | null> {
  return new Promise((resolve) => {
    database.find(
      {
        size: stats.size,
        created: stats.birthtime.toISOString(),
        path: { $ne: currentPath }, // Don't match the current path
      },
      (err: Error | null, docs: Media[]) => {
        if (err || !docs || docs.length === 0) {
          resolve(null);
          return;
        }

        // If we have multiple matches, try to find the best one
        // For now, we'll just take the first one, but we could add more sophisticated matching
        resolve(docs[0]);
      }
    );
  });
}

export async function scanLibraryForMediaFiles(libraryPath: string): Promise<Media[]> {
  const mediaFiles: Media[] = [];
  const database = await mediaDb();
  const processedPaths = new Set<string>();

  try {
    for await (const filePath of walkDirectory(libraryPath)) {
      const ext = path.extname(filePath).toLowerCase();

      // Check if file extension matches supported formats
      const isImage = IMAGE_EXTENSIONS.has(ext);
      const isVideo = VIDEO_EXTENSIONS.has(ext);

      if (!isImage && !isVideo) continue;

      // Get file stats
      const stats = await fs.stat(filePath);

      // Check if media already exists in database
      let existingMedia: Media | null = await new Promise((resolve) => {
        database.findOne({ path: filePath }, (err: Error | null, doc: Media | null) => {
          if (err) {
            console.error("Error finding media:", err);
            resolve(null);
          } else {
            resolve(doc);
          }
        });
      });

      // If not found by path, try to find by stats (might be renamed)
      if (!existingMedia) {
        existingMedia = await findMediaByStats(database, stats, filePath);
      }

      const media: Media = {
        path: filePath,
        type: isImage ? "image" : "video",
        name: path.basename(filePath),
        size: stats.size,
        created: stats.birthtime.toISOString(),
        modified: stats.mtime.toISOString(),
        isNew: !existingMedia,
        categoryIds: existingMedia?.categoryIds || [],
      };

      if (!existingMedia) {
        // New file - create it
        await createMedia(media);
      } else {
        // File exists - check if it's renamed or modified
        const needsUpdate =
          existingMedia.path !== filePath || // Path changed (renamed)
          existingMedia.modified !== media.modified || // Content changed
          existingMedia.size !== media.size; // Size changed

        if (needsUpdate) {
          await updateMedia(existingMedia.path, {
            path: filePath,
            name: media.name,
            modified: media.modified,
            size: media.size,
            isNew: false,
          });
        }
      }

      mediaFiles.push(media);
      processedPaths.add(filePath);
    }

    // Find and delete missing files
    await new Promise<void>((resolve) => {
      database.find({}, (err: Error | null, docs: Media[]) => {
        if (err) {
          console.error("Error finding all media:", err);
          resolve();
          return;
        }

        // Delete each doc that wasn't found during the scan
        Promise.all(
          docs
            .filter((doc) => !processedPaths.has(doc.path))
            .map(async (doc) => {
              // Check if the file still exists
              try {
                await fs.access(doc.path);
              } catch {
                // File doesn't exist anymore - delete it
                console.log(`Deleting missing file from database: ${doc.path}`);
                await deleteMedia(doc.path);
              }
            })
        ).then(() => resolve());
      });
    });

    return Promise.all(mediaFiles.map(enrichMedia));
  } catch (error) {
    console.error("Error scanning library:", error);
    return [];
  }
}
