import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { Effect } from 'effect';
import { isSupportedFormat } from './formats.js';
import { scanMediaRoot } from './scan-media-root.js';
import {
  cleanupTestDirectory,
  createEmptyDirectory,
  setupTestDirectory,
  TEST_DIR,
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

describe('scanMediaRoot', () => {
  beforeEach(async () => {
    await Effect.runPromise(setupTest);
  });

  afterEach(async () => {
    await Effect.runPromise(teardownTest);
  });

  describe('successful scanning', () => {
    test('should scan directory and return media files', async () => {
      const mediaFiles = await Effect.runPromise(scanMediaRoot);

      expect(mediaFiles.length).toBeGreaterThan(0);

      const fileNames = mediaFiles.map((file) => file.fileName);
      expect(fileNames).toContain('image.jpg');
      expect(fileNames).toContain('photo.png');
      expect(fileNames).toContain('vacation1.jpg');
      expect(fileNames).toContain('vacation2.png');
      expect(fileNames).toContain('video.mp4');

      expect(fileNames).not.toContain('document.txt');
      expect(fileNames).not.toContain('script.js');
    });

    test('should handle nested directories correctly', async () => {
      const mediaFiles = await Effect.runPromise(scanMediaRoot);

      const nestedFile = mediaFiles.find(
        (file) => file.fileName === 'vacation1.jpg'
      );

      expect(nestedFile).toBeDefined();
      expect(nestedFile?.relativePath).toBe(
        '2024-01-15_vacation/vacation1.jpg'
      );
      expect(nestedFile?.absolutePath).toContain(
        '2024-01-15_vacation/vacation1.jpg'
      );
    });

    test('should handle empty directory', async () => {
      const emptyDir = await createEmptyDirectory('empty');
      process.env.MEDIA_ROOT = emptyDir;

      const mediaFiles = await Effect.runPromise(scanMediaRoot);
      expect(mediaFiles).toEqual([]);
    });

    test('should filter out non-media files', async () => {
      const mediaFiles = await Effect.runPromise(scanMediaRoot);

      const fileNames = mediaFiles.map((file) => file.fileName);

      expect(fileNames).not.toContain('document.txt');
      expect(fileNames).not.toContain('script.js');

      const supportedResults = mediaFiles.map((file) =>
        isSupportedFormat(file.absolutePath)
      );
      const allSupported = supportedResults.every(Boolean);
      expect(allSupported).toBe(true);
    });

    test('should scan mixed content directory with all supported formats', async () => {
      const mediaFiles = await Effect.runPromise(scanMediaRoot);

      const fileNames = mediaFiles.map((file) => file.fileName);

      expect(fileNames).toContain('animation.gif');
      expect(fileNames).toContain('modern.webp');
      expect(fileNames).toContain('movie.mov');
      expect(fileNames).toContain('clip.avi');
      expect(fileNames).toContain('video.mkv');

      expect(fileNames).not.toContain('script.js');
    });
  });

  describe('error handling', () => {
    test('should continue scanning when some files are inaccessible', async () => {
      const mediaFiles = await Effect.runPromise(scanMediaRoot);
      expect(mediaFiles.length).toBeGreaterThan(0);
    });
  });

  describe('relative path handling', () => {
    test('should generate correct relative paths for root files', async () => {
      const mediaFiles = await Effect.runPromise(scanMediaRoot);

      const rootFile = mediaFiles.find((file) => file.fileName === 'image.jpg');
      expect(rootFile?.relativePath).toBe('image.jpg');
    });

    test('should generate correct relative paths for nested files', async () => {
      const mediaFiles = await Effect.runPromise(scanMediaRoot);

      const nestedFile = mediaFiles.find(
        (file) => file.fileName === 'vacation1.jpg'
      );
      expect(nestedFile?.relativePath).toBe(
        '2024-01-15_vacation/vacation1.jpg'
      );
    });
  });
});
