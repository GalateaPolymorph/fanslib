import ffprobe from 'ffprobe';
import { stat } from 'fs/promises';
import { basename, extname, join } from 'path';
import sharp from 'sharp';

// FFprobe types
interface FFprobeStream {
  codec_type: string;
  width?: number;
  height?: number;
  duration?: string;
  codec_name?: string;
  bit_rate?: string;
  r_frame_rate?: string;
}

interface FFprobeMetadata {
  streams: FFprobeStream[];
}

// Configure ffprobe with binary path
const ffprobeStatic = async (filePath: string): Promise<FFprobeMetadata> =>
  (
    ffprobe as (
      path: string,
      options: { path: string }
    ) => Promise<FFprobeMetadata>
  )(filePath, { path: 'ffprobe' });

export type ImageMetadata = {
  width: number;
  height: number;
  format: string;
  hasAlpha: boolean;
  density?: number | undefined;
};

export type VideoMetadata = {
  width: number;
  height: number;
  duration: number;
  format: string;
  bitrate?: number | undefined;
  frameRate?: number | undefined;
  codec?: string | undefined;
};

export type MediaMetadata = ImageMetadata | VideoMetadata;

export type ThumbnailConfig = {
  width: number;
  height: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
};

export type MediaProcessingError = {
  type:
    | 'file_access_error'
    | 'metadata_extraction_error'
    | 'thumbnail_generation_error'
    | 'unsupported_format_error';
  message: string;
  filePath: string;
};

export type MetadataResult =
  | { success: true; data: MediaMetadata }
  | { success: false; error: MediaProcessingError };

export type ThumbnailResult =
  | { success: true; data: { thumbnailPath: string; size: number } }
  | { success: false; error: MediaProcessingError };

/**
 * Default thumbnail configuration
 */
const DEFAULT_THUMBNAIL_CONFIG: ThumbnailConfig = {
  width: 300,
  height: 300,
  quality: 80,
  format: 'jpeg',
};

/**
 * Supported image formats for Sharp
 */
const IMAGE_FORMATS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

/**
 * Supported video formats for FFprobe
 */
const VIDEO_FORMATS = new Set(['.mp4', '.mov', '.avi', '.mkv']);

/**
 * Checks if a file is an image based on extension
 */
const isImageFile = (filePath: string): boolean => {
  const ext = extname(filePath).toLowerCase();
  return IMAGE_FORMATS.has(ext);
};

/**
 * Checks if a file is a video based on extension
 */
const isVideoFile = (filePath: string): boolean => {
  const ext = extname(filePath).toLowerCase();
  return VIDEO_FORMATS.has(ext);
};

/**
 * Extracts metadata from image files using Sharp
 */
const extractImageMetadata = async (
  filePath: string
): Promise<MetadataResult> => {
  try {
    const metadata = await sharp(filePath).metadata();

    if (!metadata.width || !metadata.height) {
      return {
        success: false,
        error: {
          type: 'metadata_extraction_error',
          message: 'Could not extract image dimensions',
          filePath,
        },
      };
    }

    const imageMetadata: ImageMetadata = {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format ?? 'unknown',
      hasAlpha: metadata.hasAlpha ?? false,
      density: metadata.density,
    };

    return {
      success: true,
      data: imageMetadata,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'metadata_extraction_error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown image metadata extraction error',
        filePath,
      },
    };
  }
};

/**
 * Extracts metadata from video files using FFprobe
 */
const extractVideoMetadata = async (
  filePath: string
): Promise<MetadataResult> => {
  try {
    const metadata = await ffprobeStatic(filePath);

    const videoStream = metadata.streams.find(
      (stream: { codec_type: string }) => stream.codec_type === 'video'
    );

    if (!videoStream) {
      return {
        success: false,
        error: {
          type: 'metadata_extraction_error',
          message: 'No video stream found in file',
          filePath,
        },
      };
    }

    const width = videoStream.width;
    const height = videoStream.height;
    const duration = parseFloat(videoStream.duration ?? '0');

    if (!width || !height) {
      return {
        success: false,
        error: {
          type: 'metadata_extraction_error',
          message: 'Could not extract video dimensions',
          filePath,
        },
      };
    }

    const videoMetadata: VideoMetadata = {
      width,
      height,
      duration,
      format: videoStream.codec_name ?? 'unknown',
      bitrate: videoStream.bit_rate
        ? parseInt(videoStream.bit_rate)
        : undefined,
      frameRate: videoStream.r_frame_rate
        ? parseFloat(videoStream.r_frame_rate)
        : undefined,
      codec: videoStream.codec_name,
    };

    return {
      success: true,
      data: videoMetadata,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'metadata_extraction_error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown video metadata extraction error',
        filePath,
      },
    };
  }
};

/**
 * Extracts metadata from media files (images or videos)
 */
export const extractMediaMetadata = async (
  filePath: string
): Promise<MetadataResult> => {
  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      return {
        success: false,
        error: {
          type: 'file_access_error',
          message: 'Path is not a file',
          filePath,
        },
      };
    }
  } catch {
    return {
      success: false,
      error: {
        type: 'file_access_error',
        message: 'File does not exist or is not accessible',
        filePath,
      },
    };
  }

  if (isImageFile(filePath)) {
    return extractImageMetadata(filePath);
  }

  if (isVideoFile(filePath)) {
    return extractVideoMetadata(filePath);
  }

  return {
    success: false,
    error: {
      type: 'unsupported_format_error',
      message: 'File format not supported for metadata extraction',
      filePath,
    },
  };
};

/**
 * Generates thumbnail path based on original file path
 */
const generateThumbnailPath = (
  originalFilePath: string,
  thumbnailDir: string,
  config: ThumbnailConfig
): string => {
  const originalName = basename(originalFilePath, extname(originalFilePath));
  const thumbnailName = `${originalName}_${config.width}x${config.height}.${config.format}`;
  return join(thumbnailDir, thumbnailName);
};

/**
 * Generates thumbnail for image files using Sharp
 */
const generateImageThumbnail = async (
  filePath: string,
  thumbnailDir: string,
  config: ThumbnailConfig = DEFAULT_THUMBNAIL_CONFIG
): Promise<ThumbnailResult> => {
  const thumbnailPath = generateThumbnailPath(filePath, thumbnailDir, config);

  try {
    const sharpInstance = sharp(filePath).resize(config.width, config.height, {
      fit: 'cover',
      position: 'center',
    });

    const outputInstance = (() => {
      switch (config.format) {
        case 'jpeg':
          return sharpInstance.jpeg({ quality: config.quality });
        case 'png':
          return sharpInstance.png({ quality: config.quality });
        case 'webp':
          return sharpInstance.webp({ quality: config.quality });
        default:
          return sharpInstance.jpeg({ quality: config.quality });
      }
    })();

    await outputInstance.toFile(thumbnailPath);

    const thumbnailStats = await stat(thumbnailPath);

    return {
      success: true,
      data: {
        thumbnailPath,
        size: thumbnailStats.size,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'thumbnail_generation_error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown image thumbnail generation error',
        filePath,
      },
    };
  }
};

/**
 * Generates thumbnail for video files using FFmpeg
 */
const generateVideoThumbnail = async (
  filePath: string,
  thumbnailDir: string,
  config: ThumbnailConfig = DEFAULT_THUMBNAIL_CONFIG
): Promise<ThumbnailResult> => {
  const thumbnailPath = generateThumbnailPath(filePath, thumbnailDir, config);

  try {
    // Extract frame at 10% of video duration for better thumbnail
    const metadata = await ffprobeStatic(filePath);
    const videoStream = metadata.streams.find(
      (stream: { codec_type: string }) => stream.codec_type === 'video'
    );
    const duration = parseFloat(videoStream?.duration ?? '0');
    const seekTime = Math.max(1, duration * 0.1); // Seek to 10% or 1 second minimum

    // Use Bun subprocess to run ffmpeg
    const ffmpegProcess = Bun.spawn(
      [
        'ffmpeg',
        '-i',
        filePath,
        '-ss',
        seekTime.toString(),
        '-vframes',
        '1',
        '-vf',
        `scale=${config.width}:${config.height}:force_original_aspect_ratio=increase,crop=${config.width}:${config.height}`,
        '-q:v',
        Math.round((100 - config.quality) / 10).toString(), // Convert quality to FFmpeg scale
        '-y', // Overwrite output file
        thumbnailPath,
      ],
      {
        stdout: 'pipe',
        stderr: 'pipe',
      }
    );

    const exitCode = await ffmpegProcess.exited;

    if (exitCode !== 0) {
      const stderr = await new Response(ffmpegProcess.stderr).text();
      return {
        success: false,
        error: {
          type: 'thumbnail_generation_error',
          message: `FFmpeg failed with exit code ${exitCode}: ${stderr}`,
          filePath,
        },
      };
    }

    const thumbnailStats = await stat(thumbnailPath);

    return {
      success: true,
      data: {
        thumbnailPath,
        size: thumbnailStats.size,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'thumbnail_generation_error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown video thumbnail generation error',
        filePath,
      },
    };
  }
};

/**
 * Generates thumbnail for media files (images or videos)
 */
export const generateThumbnail = async (
  filePath: string,
  thumbnailDir: string,
  config: ThumbnailConfig = DEFAULT_THUMBNAIL_CONFIG
): Promise<ThumbnailResult> => {
  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      return {
        success: false,
        error: {
          type: 'file_access_error',
          message: 'Path is not a file',
          filePath,
        },
      };
    }
  } catch {
    return {
      success: false,
      error: {
        type: 'file_access_error',
        message: 'File does not exist or is not accessible',
        filePath,
      },
    };
  }

  // Ensure thumbnail directory exists
  try {
    await Bun.write(join(thumbnailDir, '.keep'), '');
  } catch {
    // Directory creation failed, but continue - the thumbnail generation will fail with a more specific error
  }

  if (isImageFile(filePath)) {
    return generateImageThumbnail(filePath, thumbnailDir, config);
  }

  if (isVideoFile(filePath)) {
    return generateVideoThumbnail(filePath, thumbnailDir, config);
  }

  return {
    success: false,
    error: {
      type: 'unsupported_format_error',
      message: 'File format not supported for thumbnail generation',
      filePath,
    },
  };
};

/**
 * Checks if a media file is corrupted by attempting basic operations
 */
export const validateMediaFile = async (
  filePath: string
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    if (isImageFile(filePath)) {
      // Try to read image metadata with Sharp
      await sharp(filePath).metadata();
      return { isValid: true };
    }

    if (isVideoFile(filePath)) {
      // Try to read video metadata with FFprobe
      await ffprobeStatic(filePath);
      return { isValid: true };
    }

    return { isValid: false, error: 'Unsupported file format' };
  } catch (error) {
    return {
      isValid: false,
      error:
        error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
};

/**
 * Gets supported media formats
 */
export const getSupportedFormats = (): {
  images: string[];
  videos: string[];
} => ({
  images: Array.from(IMAGE_FORMATS),
  videos: Array.from(VIDEO_FORMATS),
});

/**
 * Creates default thumbnail configuration with custom overrides
 */
export const createThumbnailConfig = (
  overrides: Partial<ThumbnailConfig>
): ThumbnailConfig => ({
  ...DEFAULT_THUMBNAIL_CONFIG,
  ...overrides,
});
