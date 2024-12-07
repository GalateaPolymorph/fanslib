import { promises as fs, Stats } from "fs";
import path from "path";
import { In, Not } from "typeorm";
import { db } from "../../lib/db";
import { walkDirectory } from "../../lib/walkDirectory";
import { Media, MediaWithoutRelations } from "./entity";
import {
  createMedia,
  deleteMedia,
  fetchAllMedia,
  fetchMediaByPath,
  updateMedia,
} from "./operations";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".avi", ".mkv"]);

/**
 * Try to find a media entry that matches the given file stats
 * This helps identify renamed files by matching size and creation time
 */
const findMediaByStats = async (stats: Stats): Promise<Media | null> => {
  return (await db()).getRepository(Media).findOne({
    where: {
      size: stats.size,
      createdAt: stats.ctime.toISOString(),
    },
  });
};

export async function scanLibraryForMediaFiles(libraryPath: string): Promise<Media[]> {
  const mediaFiles: MediaWithoutRelations[] = [];
  const database = await db();
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
      let existingMedia = await fetchMediaByPath(filePath);

      // If not found by path, try to find by stats (might be renamed)
      if (!existingMedia) {
        existingMedia = await findMediaByStats(stats);
      }

      const media: MediaWithoutRelations = {
        path: filePath,
        type: isImage ? "image" : "video",
        name: path.basename(filePath),
        size: stats.size,
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString(),
        isNew: !existingMedia,
        categoryIds: existingMedia?.categoryIds || [],
      };

      if (!existingMedia) {
        await createMedia(media);
      } else {
        // File exists - check if it's renamed or modified
        const needsUpdate =
          existingMedia.path !== filePath || // Path changed (renamed)
          existingMedia.modifiedAt !== media.modifiedAt || // Content changed
          existingMedia.size !== media.size; // Size changed

        if (needsUpdate) {
          await updateMedia(existingMedia.path, {
            ...existingMedia,
            path: filePath,
            name: media.name,
            modifiedAt: media.modifiedAt,
            size: media.size,
            isNew: false,
          });
        }
      }

      // Enrich media with categories before adding to results
      mediaFiles.push(media);
      processedPaths.add(filePath);
    }

    // Find and delete missing files
    const missingFiles = await database.getRepository(Media).find({
      where: { path: Not(In(Array.from(processedPaths))) },
    });
    for (const missingFile of missingFiles) {
      // Check if the file still exists
      try {
        await fs.access(missingFile.path);
      } catch {
        // File doesn't exist anymore - delete it
        console.log(`Deleting missing file from database: ${missingFile.path}`);
        await deleteMedia(missingFile.path);
      }
    }

    // Refetch media with categories
    return fetchAllMedia();
  } catch (error) {
    console.error("Error scanning library:", error);
    return [];
  }
}
