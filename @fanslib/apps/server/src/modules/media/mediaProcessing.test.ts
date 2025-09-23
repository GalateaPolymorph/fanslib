import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { mkdir, rmdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import {
  createThumbnailConfig,
  extractMediaMetadata,
  generateThumbnail,
  getSupportedFormats,
  validateMediaFile,
  type ImageMetadata,
  type ThumbnailConfig,
  type VideoMetadata,
} from './mediaProcessing';

describe('Media Processing Utilities', () => {
  const testDir = join(process.cwd(), 'tests', 'fixtures', 'media');
  const thumbnailDir = join(testDir, 'thumbnails');
  const testImagePath = join(testDir, 'test-image.jpg');
  const corruptedImagePath = join(testDir, 'corrupted.jpg');
  const testVideoPath = join(testDir, 'test-video.mp4');
  const corruptedVideoPath = join(testDir, 'corrupted.mp4');

  beforeAll(async () => {
    // Create test directories
    await mkdir(testDir, { recursive: true });
    await mkdir(thumbnailDir, { recursive: true });

    // Create a valid test image using Sharp
    await sharp({
      create: {
        width: 800,
        height: 600,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .jpeg({ quality: 80 })
      .toFile(testImagePath);

    // Create a corrupted image file
    await writeFile(corruptedImagePath, 'not-an-image-file');

    // Create a test video using FFmpeg (assuming it's available)
    const ffmpegProcess = Bun.spawn([
      'ffmpeg',
      '-f',
      'lavfi',
      '-i',
      'testsrc=duration=2:size=640x480:rate=30',
      '-c:v',
      'libx264',
      '-t',
      '2',
      '-pix_fmt',
      'yuv420p',
      '-y',
      testVideoPath,
    ]);
    await ffmpegProcess.exited;

    // Create a corrupted video file
    await writeFile(corruptedVideoPath, 'not-a-video-file');
  });

  beforeEach(async () => {
    // Clean up thumbnail directory before each test
    try {
      const files = await Bun.file(thumbnailDir).exists();
      if (files) {
        // Remove any existing thumbnails
        const globResult = new Bun.Glob('*').scan(thumbnailDir);
        const fileIterator = globResult[Symbol.asyncIterator]();
        const getAllFiles = async (acc: string[]): Promise<string[]> => {
          const { value, done } = await fileIterator.next();
          if (done) return acc;
          return getAllFiles([...acc, value]);
        };
        const allFiles = await getAllFiles([]);
        await Promise.all(
          allFiles.map((file) => unlink(join(thumbnailDir, file)))
        );
      }
    } catch {
      // Directory might not exist, which is fine
    }
  });

  describe('getSupportedFormats', () => {
    it('should return supported image and video formats', () => {
      const formats = getSupportedFormats();

      expect(formats.images).toContain('.jpg');
      expect(formats.images).toContain('.jpeg');
      expect(formats.images).toContain('.png');
      expect(formats.images).toContain('.gif');
      expect(formats.images).toContain('.webp');

      expect(formats.videos).toContain('.mp4');
      expect(formats.videos).toContain('.mov');
      expect(formats.videos).toContain('.avi');
      expect(formats.videos).toContain('.mkv');
    });

    it('should return arrays with expected lengths', () => {
      const formats = getSupportedFormats();

      expect(formats.images.length).toBe(5);
      expect(formats.videos.length).toBe(4);
    });
  });

  describe('createThumbnailConfig', () => {
    it('should create default thumbnail config when no overrides provided', () => {
      const config = createThumbnailConfig({});

      expect(config.width).toBe(300);
      expect(config.height).toBe(300);
      expect(config.quality).toBe(80);
      expect(config.format).toBe('jpeg');
    });

    it('should override specific properties while keeping defaults', () => {
      const config = createThumbnailConfig({
        width: 150,
        format: 'webp',
      });

      expect(config.width).toBe(150);
      expect(config.height).toBe(300); // default
      expect(config.quality).toBe(80); // default
      expect(config.format).toBe('webp');
    });

    it('should allow all properties to be overridden', () => {
      const customConfig: ThumbnailConfig = {
        width: 500,
        height: 400,
        quality: 95,
        format: 'png',
      };

      const config = createThumbnailConfig(customConfig);

      expect(config).toEqual(customConfig);
    });
  });

  describe('validateMediaFile', () => {
    it('should validate a good image file', async () => {
      const result = await validateMediaFile(testImagePath);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject a corrupted image file', async () => {
      const result = await validateMediaFile(corruptedImagePath);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
    });

    it('should reject non-existent file', async () => {
      const result = await validateMediaFile(
        join(testDir, 'does-not-exist.jpg')
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject unsupported file format', async () => {
      const textFilePath = join(testDir, 'text-file.txt');
      await writeFile(textFilePath, 'This is a text file');

      const result = await validateMediaFile(textFilePath);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported file format');

      await unlink(textFilePath);
    });

    it('should validate a good video file', async () => {
      const result = await validateMediaFile(testVideoPath);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject a corrupted video file', async () => {
      const result = await validateMediaFile(corruptedVideoPath);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
    });
  });

  describe('extractMediaMetadata', () => {
    it('should extract metadata from image file', async () => {
      const result = await extractMediaMetadata(testImagePath);

      expect(result.success).toBe(true);
      if (result.success) {
        const metadata = result.data as ImageMetadata;
        expect(metadata.width).toBe(800);
        expect(metadata.height).toBe(600);
        expect(metadata.format).toBe('jpeg');
        if ('hasAlpha' in metadata) {
          expect(metadata.hasAlpha).toBe(false);
        }
        if ('density' in metadata) {
          expect(typeof metadata.density).toBe('number');
        }
      }
    });

    it('should handle corrupted image file', async () => {
      const result = await extractMediaMetadata(corruptedImagePath);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('metadata_extraction_error');
        expect(result.error.filePath).toBe(corruptedImagePath);
      }
    });

    it('should handle non-existent file', async () => {
      const result = await extractMediaMetadata(
        join(testDir, 'does-not-exist.jpg')
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('file_access_error');
        expect(result.error.message).toContain('does not exist');
      }
    });

    it('should handle unsupported file format', async () => {
      const textFilePath = join(testDir, 'text-file.txt');
      await writeFile(textFilePath, 'This is a text file');

      const result = await extractMediaMetadata(textFilePath);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('unsupported_format_error');
        expect(result.error.message).toContain('not supported');
      }

      await unlink(textFilePath);
    });

    it('should extract metadata from video file', async () => {
      const result = await extractMediaMetadata(testVideoPath);

      expect(result.success).toBe(true);
      if (result.success) {
        const metadata = result.data as VideoMetadata;
        expect(metadata.width).toBe(640);
        expect(metadata.height).toBe(480);
        expect(metadata.duration).toBeCloseTo(2, 1); // ~2 seconds
        expect(metadata.format).toBeDefined();
        expect(typeof metadata.frameRate).toBe('number');
        expect(typeof metadata.codec).toBe('string');
      }
    });

    it('should handle corrupted video file', async () => {
      const result = await extractMediaMetadata(corruptedVideoPath);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('metadata_extraction_error');
        expect(result.error.filePath).toBe(corruptedVideoPath);
      }
    });

    it('should handle directory path', async () => {
      const result = await extractMediaMetadata(testDir);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('file_access_error');
        expect(result.error.message).toContain('not a file');
      }
    });
  });

  describe('generateThumbnail', () => {
    it('should generate thumbnail for image file with default config', async () => {
      const result = await generateThumbnail(testImagePath, thumbnailDir);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.thumbnailPath).toContain('test-image_300x300.jpeg');
        expect(result.data.size).toBeGreaterThan(0);

        // Verify thumbnail file exists and has correct dimensions
        const thumbnailFile = Bun.file(result.data.thumbnailPath);
        expect(await thumbnailFile.exists()).toBe(true);

        const metadata = await sharp(result.data.thumbnailPath).metadata();
        expect(metadata.width).toBe(300);
        expect(metadata.height).toBe(300);
      }
    });

    it('should generate thumbnail with custom config', async () => {
      const customConfig = createThumbnailConfig({
        width: 150,
        height: 100,
        format: 'png',
        quality: 90,
      });

      const result = await generateThumbnail(
        testImagePath,
        thumbnailDir,
        customConfig
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.thumbnailPath).toContain('test-image_150x100.png');

        const metadata = await sharp(result.data.thumbnailPath).metadata();
        expect(metadata.width).toBe(150);
        expect(metadata.height).toBe(100);
        expect(metadata.format).toBe('png');
      }
    });

    it('should generate WebP thumbnail', async () => {
      const webpConfig = createThumbnailConfig({
        format: 'webp',
        quality: 85,
      });

      const result = await generateThumbnail(
        testImagePath,
        thumbnailDir,
        webpConfig
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.thumbnailPath).toContain('.webp');
        const metadata = await sharp(result.data.thumbnailPath).metadata();
        expect(metadata.format).toBe('webp');
      }
    });

    it('should handle corrupted image file', async () => {
      const result = await generateThumbnail(corruptedImagePath, thumbnailDir);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('thumbnail_generation_error');
        expect(result.error.filePath).toBe(corruptedImagePath);
      }
    });

    it('should handle non-existent file', async () => {
      const result = await generateThumbnail(
        join(testDir, 'does-not-exist.jpg'),
        thumbnailDir
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('file_access_error');
        expect(result.error.message).toContain('does not exist');
      }
    });

    it('should handle unsupported file format', async () => {
      const textFilePath = join(testDir, 'text-file.txt');
      await writeFile(textFilePath, 'This is a text file');

      const result = await generateThumbnail(textFilePath, thumbnailDir);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('unsupported_format_error');
        expect(result.error.message).toContain('not supported');
      }

      await unlink(textFilePath);
    });

    it('should generate thumbnail for video file with default config', async () => {
      const result = await generateThumbnail(testVideoPath, thumbnailDir);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.thumbnailPath).toContain('test-video_300x300.jpeg');
        expect(result.data.size).toBeGreaterThan(0);

        // Verify thumbnail file exists and has correct dimensions
        const thumbnailFile = Bun.file(result.data.thumbnailPath);
        expect(await thumbnailFile.exists()).toBe(true);

        const metadata = await sharp(result.data.thumbnailPath).metadata();
        expect(metadata.width).toBe(300);
        expect(metadata.height).toBe(300);
      }
    });

    it('should generate video thumbnail with custom config', async () => {
      const customConfig = createThumbnailConfig({
        width: 200,
        height: 150,
        format: 'png',
        quality: 95,
      });

      const result = await generateThumbnail(
        testVideoPath,
        thumbnailDir,
        customConfig
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.thumbnailPath).toContain('test-video_200x150.png');

        const metadata = await sharp(result.data.thumbnailPath).metadata();
        expect(metadata.width).toBe(200);
        expect(metadata.height).toBe(150);
        expect(metadata.format).toBe('png');
      }
    });

    it('should generate WebP thumbnail from video', async () => {
      const webpConfig = createThumbnailConfig({
        format: 'webp',
        quality: 85,
      });

      const result = await generateThumbnail(
        testVideoPath,
        thumbnailDir,
        webpConfig
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.thumbnailPath).toContain('.webp');
        const metadata = await sharp(result.data.thumbnailPath).metadata();
        expect(metadata.format).toBe('webp');
      }
    });

    it('should handle corrupted video file for thumbnail generation', async () => {
      const result = await generateThumbnail(corruptedVideoPath, thumbnailDir);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('thumbnail_generation_error');
        expect(result.error.filePath).toBe(corruptedVideoPath);
      }
    });

    it('should handle directory path', async () => {
      const result = await generateThumbnail(testDir, thumbnailDir);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('file_access_error');
        expect(result.error.message).toContain('not a file');
      }
    });

    it('should create thumbnail directory if it does not exist', async () => {
      const newThumbnailDir = join(testDir, 'new-thumbnails');

      const result = await generateThumbnail(testImagePath, newThumbnailDir);

      expect(result.success).toBe(true);
      if (result.success) {
        const thumbnailFile = Bun.file(result.data.thumbnailPath);
        expect(await thumbnailFile.exists()).toBe(true);
      }

      // Clean up
      try {
        await unlink(join(newThumbnailDir, 'test-image_300x300.jpeg'));
        await rmdir(newThumbnailDir);
      } catch {
        // Cleanup failed, but test passed
      }
    });
  });

  describe('video format support', () => {
    const videoFormats = ['.mp4', '.mov', '.avi', '.mkv'];

    videoFormats.forEach((format) => {
      it(`should recognize ${format} as supported video format`, () => {
        const formats = getSupportedFormats();
        expect(formats.videos).toContain(format);
      });
    });

    it('should extract metadata from different video formats', async () => {
      // Test with our generated MP4 file
      const result = await extractMediaMetadata(testVideoPath);
      expect(result.success).toBe(true);

      if (result.success) {
        const metadata = result.data as VideoMetadata;
        expect(metadata.width).toBeGreaterThan(0);
        expect(metadata.height).toBeGreaterThan(0);
        expect(metadata.duration).toBeGreaterThan(0);
      }
    });
  });

  describe('error handling', () => {
    it('should return proper error types for different failure scenarios', async () => {
      // Test file access error
      const accessResult = await extractMediaMetadata('/non/existent/path.jpg');
      expect(accessResult.success).toBe(false);
      if (!accessResult.success) {
        expect(accessResult.error.type).toBe('file_access_error');
      }

      // Test unsupported format error
      const textFile = join(testDir, 'test.txt');
      await writeFile(textFile, 'text content');
      const formatResult = await extractMediaMetadata(textFile);
      expect(formatResult.success).toBe(false);
      if (!formatResult.success) {
        expect(formatResult.error.type).toBe('unsupported_format_error');
      }
      await unlink(textFile);

      // Test metadata extraction error
      const metadataResult = await extractMediaMetadata(corruptedImagePath);
      expect(metadataResult.success).toBe(false);
      if (!metadataResult.success) {
        expect(metadataResult.error.type).toBe('metadata_extraction_error');
      }
    });

    it('should include file path in error messages', async () => {
      const testPath = '/non/existent/file.jpg';
      const result = await extractMediaMetadata(testPath);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.filePath).toBe(testPath);
      }
    });
  });

  describe('functional programming compliance', () => {
    it('should return consistent data structures', async () => {
      const result = await extractMediaMetadata(testImagePath);

      expect(result.success).toBe(true);
      if (result.success) {
        const metadata = result.data;
        // Verify metadata has expected structure
        expect(typeof metadata.width).toBe('number');
        expect(typeof metadata.height).toBe('number');
        expect(typeof metadata.format).toBe('string');
        if ('hasAlpha' in metadata) {
          expect(typeof metadata.hasAlpha).toBe('boolean');
        }
        expect(metadata.width).toBe(800);
        expect(metadata.height).toBe(600);
      }
    });

    it('should handle video metadata structure correctly', async () => {
      const result = await extractMediaMetadata(testVideoPath);

      expect(result.success).toBe(true);
      if (result.success) {
        const metadata = result.data as VideoMetadata;
        // Verify video-specific metadata structure
        expect(typeof metadata.width).toBe('number');
        expect(typeof metadata.height).toBe('number');
        expect(typeof metadata.duration).toBe('number');
        expect(typeof metadata.format).toBe('string');
        expect(metadata.width).toBe(640);
        expect(metadata.height).toBe(480);
        expect(metadata.duration).toBeCloseTo(2, 1);

        // Optional video properties
        if ('frameRate' in metadata) {
          expect(typeof metadata.frameRate).toBe('number');
        }
        if ('codec' in metadata) {
          expect(typeof metadata.codec).toBe('string');
        }
        if ('bitrate' in metadata) {
          expect(typeof metadata.bitrate).toBe('number');
        }
      }
    });

    it('should never mutate input parameters', async () => {
      const config = createThumbnailConfig({ width: 200 });
      const originalConfig = { ...config };

      await generateThumbnail(testImagePath, thumbnailDir, config);

      // Config object should remain unchanged
      expect(config).toEqual(originalConfig);
    });

    it('should never mutate input parameters for video thumbnails', async () => {
      const config = createThumbnailConfig({ width: 150, format: 'webp' });
      const originalConfig = { ...config };

      await generateThumbnail(testVideoPath, thumbnailDir, config);

      // Config object should remain unchanged
      expect(config).toEqual(originalConfig);
    });
  });
});
