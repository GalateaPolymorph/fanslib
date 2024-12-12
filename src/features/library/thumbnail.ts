import { spawn } from "child_process";
import { app } from "electron";
import { promises as fs } from "fs";
import path from "path";

const THUMBNAIL_DIR = path.join(app.getPath("userData"), "thumbnails");

/**
 * Ensure the thumbnails directory exists
 */
async function ensureThumbnailDir() {
  try {
    await fs.access(THUMBNAIL_DIR);
  } catch {
    await fs.mkdir(THUMBNAIL_DIR, { recursive: true });
  }
}

/**
 * Generate a thumbnail for a media file using ffmpeg
 * @param mediaPath Path to the media file
 * @param mediaId ID of the media entry
 * @param type Type of media ('image' | 'video')
 */
export async function generateThumbnail(
  mediaPath: string,
  mediaId: string,
  type: "image" | "video"
): Promise<string> {
  await ensureThumbnailDir();

  const thumbnailPath = path.join(THUMBNAIL_DIR, `${mediaId}.jpg`);

  // Check if thumbnail already exists
  try {
    await fs.access(thumbnailPath);
    return thumbnailPath;
  } catch {
    // Thumbnail doesn't exist, create it
  }

  return new Promise((resolve, reject) => {
    let ffmpegArgs: string[];

    if (type === "video") {
      // For videos, take a frame at 1 second or 10% of duration, whichever is less
      ffmpegArgs = [
        "-ss",
        "1",
        "-i",
        mediaPath,
        "-vframes",
        "1",
        "-vf",
        "scale=320:-1",
        "-y",
        thumbnailPath,
      ];
    } else {
      // For images, just resize
      ffmpegArgs = ["-i", mediaPath, "-vf", "scale=320:-1", "-y", thumbnailPath];
    }

    const ffmpeg = spawn("ffmpeg", ffmpegArgs);

    ffmpeg.on("error", (err) => {
      reject(new Error(`Failed to spawn ffmpeg: ${err.message}`));
    });

    ffmpeg.on("exit", (code) => {
      if (code === 0) {
        resolve(thumbnailPath);
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
}

/**
 * Get the path to a thumbnail for a given media ID
 */
export function getThumbnailPath(mediaId: string): string {
  return path.join(THUMBNAIL_DIR, `${mediaId.replace(/\/$/, "")}.jpg`);
}

/**
 * Check if a thumbnail exists for a given media ID
 */
export async function thumbnailExists(mediaId: string): Promise<boolean> {
  try {
    await fs.access(getThumbnailPath(mediaId));
    return true;
  } catch {
    return false;
  }
}
