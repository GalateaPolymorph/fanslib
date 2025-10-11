import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { Effect } from 'effect';
import { join } from 'path';
import {
  extractFileMetadata,
  FileNotSupportedError,
} from './extract-metadata.js';
import { FileAccessError } from './file-stats.js';
import {
  cleanupTestDirectory,
  MIXED_DIR,
  setupTestDirectory,
  TEST_DIR,
  TEST_FILES,
} from './test-utils.js';

const originalMediaRoot: string | undefined = process.env.MEDIA_ROOT;

const setupTest = Effect.gen(function* () {
  yield* Effect.promise(() => cleanupTestDirectory());
  yield* Effect.promise(() => setupTestDirectory());
  yield* Effect.sync(() => {
    process.env.MEDIA_ROOT = TEST_DIR;
  });
});

const teardownTest = Effect.gen(function* () {
  yield* Effect.promise(() => cleanupTestDirectory());
  yield* Effect.sync(() => {
    process.env.MEDIA_ROOT = originalMediaRoot;
  });
});

describe('extractFileMetadata', () => {
  beforeEach(async () => {
    await Effect.runPromise(setupTest);
  });

  afterEach(async () => {
    await Effect.runPromise(teardownTest);
  });

  describe('successful metadata extraction', () => {
    test('should extract correct metadata for JPEG files', async () => {
      const filePath = join(TEST_DIR, 'image.jpg');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );

      expect(metadata.absolutePath).toBe(filePath);
      expect(metadata.fileName).toBe('image.jpg');
      expect(metadata.fileSize).toBe(TEST_FILES['image.jpg'].length);
      expect(metadata.mimeType).toBe('image/jpeg');
      expect(metadata.contentHash).toBeDefined();
      expect(metadata.contentHash.length).toBe(64);
      expect(metadata.relativePath).toBe('image.jpg');
      expect(metadata.createdAt).toBeInstanceOf(Date);
      expect(metadata.modifiedAt).toBeInstanceOf(Date);
    });

    test('should extract correct metadata for PNG files', async () => {
      const filePath = join(TEST_DIR, 'photo.png');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );

      expect(metadata.fileName).toBe('photo.png');
      expect(metadata.fileSize).toBe(TEST_FILES['photo.png'].length);
      expect(metadata.mimeType).toBe('image/png');
      expect(metadata.relativePath).toBe('photo.png');
    });

    test('should extract correct metadata for video files', async () => {
      const filePath = join(MIXED_DIR, 'movie.mov');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );

      expect(metadata.fileName).toBe('movie.mov');
      expect(metadata.fileSize).toBe(TEST_FILES['movie.mov'].length);
      expect(metadata.mimeType).toBe('video/quicktime');
      expect(metadata.relativePath).toBe('mixed-content/movie.mov');
    });

    test('should handle nested file paths correctly', async () => {
      const filePath = join(TEST_DIR, '2024-01-15_vacation', 'vacation1.jpg');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );

      expect(metadata.fileName).toBe('vacation1.jpg');
      expect(metadata.relativePath).toBe('2024-01-15_vacation/vacation1.jpg');
      expect(metadata.absolutePath).toBe(filePath);
    });

    test('should extract metadata for GIF format', async () => {
      const filePath = join(MIXED_DIR, 'animation.gif');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );

      expect(metadata.fileName).toBe('animation.gif');
      expect(metadata.mimeType).toBe('image/gif');
    });
  });

  describe('content hash generation', () => {
    test('should generate consistent hashes for same content', async () => {
      const filePath = join(TEST_DIR, 'image.jpg');

      const metadata1 = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );
      const metadata2 = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );

      expect(metadata1.contentHash).toBeDefined();
      expect(metadata2.contentHash).toBeDefined();
      expect(metadata1.contentHash).toBe(metadata2.contentHash);
    });

    test('should generate different hashes for different content', async () => {
      const jpegPath = join(TEST_DIR, 'image.jpg');
      const pngPath = join(TEST_DIR, 'photo.png');

      const jpegMetadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, jpegPath)
      );
      const pngMetadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, pngPath)
      );

      expect(jpegMetadata.contentHash).toBeDefined();
      expect(pngMetadata.contentHash).toBeDefined();
      expect(jpegMetadata.contentHash).not.toBe(pngMetadata.contentHash);
    });

    test('should generate valid SHA-256 hashes', async () => {
      const filePath = join(TEST_DIR, 'image.jpg');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );

      const hash = metadata.contentHash;

      expect(hash.length).toBe(64);
      expect(/^[a-f0-9]+$/.test(hash)).toBe(true);
    });
  });

  describe('error handling', () => {
    test('should fail with FileNotSupportedError for unsupported files', async () => {
      const filePath = join(MIXED_DIR, 'script.js');

      const result = await Effect.runPromise(
        Effect.either(extractFileMetadata(TEST_DIR, filePath))
      );

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left).toBeInstanceOf(FileNotSupportedError);
      }
    });

    test('should fail with FileAccessError for non-existent files', async () => {
      const filePath = join(TEST_DIR, 'non-existent.jpg');

      const result = await Effect.runPromise(
        Effect.either(extractFileMetadata(TEST_DIR, filePath))
      );

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left).toBeInstanceOf(FileAccessError);
      }
    });
  });

  describe('edge cases', () => {
    test('should handle empty files', async () => {
      const filePath = join(MIXED_DIR, 'empty.jpg');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );

      expect(metadata.fileName).toBe('empty.jpg');
      expect(metadata.fileSize).toBe(0);
      expect(metadata.contentHash).toBeDefined();
    });

    test('should handle WebP format', async () => {
      const filePath = join(MIXED_DIR, 'modern.webp');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, filePath)
      );

      expect(metadata.fileName).toBe('modern.webp');
      expect(metadata.mimeType).toBe('image/webp');
    });

    test('should handle various video formats', async () => {
      const testCases = [
        { file: 'video.mkv', mime: 'video/x-matroska' },
        { file: 'clip.avi', mime: 'video/x-msvideo' },
      ];

      const results = await Promise.all(
        testCases.map(async ({ file, mime }) => {
          const filePath = join(MIXED_DIR, file);
          const metadata = await Effect.runPromise(
            extractFileMetadata(TEST_DIR, filePath)
          );

          return {
            fileName: metadata.fileName,
            mimeType: metadata.mimeType,
            expected: { file, mime },
          };
        })
      );

      results.forEach(({ fileName, mimeType, expected }) => {
        expect(fileName).toBe(expected.file);
        expect(mimeType).toBe(expected.mime);
      });
    });
  });

  describe('path handling', () => {
    test('should handle absolute paths correctly', async () => {
      const relativePath = join(TEST_DIR, 'image.jpg');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, relativePath)
      );

      expect(metadata.absolutePath).toBe(relativePath);
      expect(metadata.fileName).toBe('image.jpg');
    });

    test('should compute relative paths correctly for nested structures', async () => {
      const nestedPath = join(TEST_DIR, '2024-01-15_vacation', 'vacation2.png');
      const metadata = await Effect.runPromise(
        extractFileMetadata(TEST_DIR, nestedPath)
      );

      expect(metadata.relativePath).toBe('2024-01-15_vacation/vacation2.png');
    });
  });
});
