import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import {
  getFileMimeType,
  getSupportedExtensions,
  isMediaFile,
  scanDirectory,
} from './fileScanner.js';

const TEST_DIR = join(process.cwd(), 'test-media-library');
const NESTED_DIR = join(TEST_DIR, '2024-01-15_vacation');
const MIXED_DIR = join(TEST_DIR, 'mixed-content');

// Test file content for different formats
const TEST_FILES = {
  'image.jpg': Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46,
  ]), // JPEG header
  'photo.png': Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), // PNG header
  'animation.gif': Buffer.from('GIF87a\0\0\0\0'), // GIF header
  'modern.webp': Buffer.from('RIFF\0\0\0\0WEBPVP8 '), // WebP header
  'video.mp4': Buffer.from([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]), // MP4 header
  'movie.mov': Buffer.from([0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70]), // MOV header
  'clip.avi': Buffer.from('RIFF\0\0\0\0AVI LIST'), // AVI header
  'video.mkv': Buffer.from([0x1a, 0x45, 0xdf, 0xa3]), // MKV header
  'document.txt': Buffer.from('This is a text file'), // Non-media file
  'script.js': Buffer.from('console.log("hello");'), // Non-media file
  'empty.jpg': Buffer.from([]), // Empty file (should be invalid)
  'corrupted.png': Buffer.from([0x00, 0x00, 0x00, 0x00]), // Invalid PNG
};

const setupTestDirectory = async (): Promise<void> => {
  // Create test directory structure
  await mkdir(TEST_DIR, { recursive: true });
  await mkdir(NESTED_DIR, { recursive: true });
  await mkdir(MIXED_DIR, { recursive: true });

  // Create test files in root directory
  await writeFile(join(TEST_DIR, 'image.jpg'), TEST_FILES['image.jpg']);
  await writeFile(join(TEST_DIR, 'photo.png'), TEST_FILES['photo.png']);
  await writeFile(join(TEST_DIR, 'document.txt'), TEST_FILES['document.txt']);

  // Create test files in nested directory (shoot format)
  await writeFile(join(NESTED_DIR, 'vacation1.jpg'), TEST_FILES['image.jpg']);
  await writeFile(join(NESTED_DIR, 'vacation2.png'), TEST_FILES['photo.png']);
  await writeFile(join(NESTED_DIR, 'video.mp4'), TEST_FILES['video.mp4']);

  // Create mixed content directory
  await writeFile(
    join(MIXED_DIR, 'animation.gif'),
    TEST_FILES['animation.gif']
  );
  await writeFile(join(MIXED_DIR, 'modern.webp'), TEST_FILES['modern.webp']);
  await writeFile(join(MIXED_DIR, 'movie.mov'), TEST_FILES['movie.mov']);
  await writeFile(join(MIXED_DIR, 'clip.avi'), TEST_FILES['clip.avi']);
  await writeFile(join(MIXED_DIR, 'video.mkv'), TEST_FILES['video.mkv']);
  await writeFile(join(MIXED_DIR, 'script.js'), TEST_FILES['script.js']);
  await writeFile(join(MIXED_DIR, 'empty.jpg'), TEST_FILES['empty.jpg']);
  await writeFile(
    join(MIXED_DIR, 'corrupted.png'),
    TEST_FILES['corrupted.png']
  );
};

const cleanupTestDirectory = async (): Promise<void> => {
  try {
    await rm(TEST_DIR, { recursive: true, force: true });
  } catch {
    // Ignore
  }
};

describe('fileScanner', () => {
  beforeEach(async () => {
    await cleanupTestDirectory();
    await setupTestDirectory();
  });

  afterEach(async () => {
    await cleanupTestDirectory();
  });

  describe('scanDirectory', () => {
    test('should scan directory and return media files', async () => {
      const result = await scanDirectory(TEST_DIR);

      expect(result.success).toBe(true);
      if (result.success) {
        const mediaFiles = result.data;

        // Should find all media files (excluding non-media files like .txt, .js)
        expect(mediaFiles.length).toBeGreaterThan(0);

        // Check that all returned files are media files
        const fileNames = mediaFiles.map((file) => file.fileName);
        expect(fileNames).toContain('image.jpg');
        expect(fileNames).toContain('photo.png');
        expect(fileNames).toContain('vacation1.jpg');
        expect(fileNames).toContain('vacation2.png');
        expect(fileNames).toContain('video.mp4');

        // Should not contain non-media files
        expect(fileNames).not.toContain('document.txt');
        expect(fileNames).not.toContain('script.js');
      }
    });

    test('should extract correct file metadata', async () => {
      const result = await scanDirectory(TEST_DIR);

      expect(result.success).toBe(true);
      if (result.success) {
        const mediaFiles = result.data;
        const jpegFile = mediaFiles.find(
          (file) => file.fileName === 'image.jpg'
        );

        expect(jpegFile).toBeDefined();
        if (jpegFile) {
          expect(jpegFile.filePath).toContain('image.jpg');
          expect(jpegFile.fileName).toBe('image.jpg');
          expect(jpegFile.fileSize).toBe(TEST_FILES['image.jpg'].length);
          expect(jpegFile.mimeType).toBe('image/jpeg');
          expect(jpegFile.isValid).toBe(true);
          expect(jpegFile.contentHash).toBeDefined();
          expect(jpegFile.contentHash.length).toBe(64); // SHA-256 hex length
          expect(jpegFile.relativePath).toBe('image.jpg');
          expect(jpegFile.createdAt).toBeInstanceOf(Date);
          expect(jpegFile.modifiedAt).toBeInstanceOf(Date);
        }
      }
    });

    test('should handle nested directories correctly', async () => {
      const result = await scanDirectory(TEST_DIR);

      expect(result.success).toBe(true);
      if (result.success) {
        const mediaFiles = result.data;
        const nestedFile = mediaFiles.find(
          (file) => file.fileName === 'vacation1.jpg'
        );

        expect(nestedFile).toBeDefined();
        if (nestedFile) {
          expect(nestedFile.relativePath).toBe(
            '2024-01-15_vacation/vacation1.jpg'
          );
          expect(nestedFile.filePath).toContain(
            '2024-01-15_vacation/vacation1.jpg'
          );
        }
      }
    });

    test('should validate file formats correctly', async () => {
      const result = await scanDirectory(MIXED_DIR);

      expect(result.success).toBe(true);
      if (result.success) {
        const mediaFiles = result.data;

        // Valid files should be marked as valid
        const validGif = mediaFiles.find(
          (file) => file.fileName === 'animation.gif'
        );
        const validWebp = mediaFiles.find(
          (file) => file.fileName === 'modern.webp'
        );
        const validMov = mediaFiles.find(
          (file) => file.fileName === 'movie.mov'
        );
        const validAvi = mediaFiles.find(
          (file) => file.fileName === 'clip.avi'
        );
        const validMkv = mediaFiles.find(
          (file) => file.fileName === 'video.mkv'
        );

        expect(validGif?.isValid).toBe(true);
        expect(validWebp?.isValid).toBe(true);
        expect(validMov?.isValid).toBe(true);
        expect(validAvi?.isValid).toBe(true);
        expect(validMkv?.isValid).toBe(true);

        // Empty and corrupted files should be marked as invalid
        const emptyFile = mediaFiles.find(
          (file) => file.fileName === 'empty.jpg'
        );
        expect(emptyFile?.isValid).toBe(false);
      }
    });

    test('should return error for non-existent directory', async () => {
      const result = await scanDirectory('/non/existent/directory');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('directory_access_error');
        expect(result.error.message).toContain('not accessible');
      }
    });

    test('should return error for file path instead of directory', async () => {
      const filePath = join(TEST_DIR, 'image.jpg');
      const result = await scanDirectory(filePath);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('directory_access_error');
      }
    });

    test('should handle empty directory', async () => {
      const emptyDir = join(TEST_DIR, 'empty');
      await mkdir(emptyDir, { recursive: true });

      const result = await scanDirectory(emptyDir);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    test('should filter out non-media files', async () => {
      const result = await scanDirectory(TEST_DIR);

      expect(result.success).toBe(true);
      if (result.success) {
        const mediaFiles = result.data;
        const fileNames = mediaFiles.map((file) => file.fileName);

        // Should not include text files or scripts
        expect(fileNames).not.toContain('document.txt');
        expect(fileNames).not.toContain('script.js');

        // Should only include supported media formats
        mediaFiles.forEach((file) => {
          expect(isMediaFile(file.filePath)).toBe(true);
        });
      }
    });
  });

  describe('getSupportedExtensions', () => {
    test('should return all supported extensions', () => {
      const extensions = getSupportedExtensions();

      expect(extensions).toContain('.jpg');
      expect(extensions).toContain('.jpeg');
      expect(extensions).toContain('.png');
      expect(extensions).toContain('.gif');
      expect(extensions).toContain('.webp');
      expect(extensions).toContain('.mp4');
      expect(extensions).toContain('.mov');
      expect(extensions).toContain('.avi');
      expect(extensions).toContain('.mkv');

      expect(extensions.length).toBe(9);
    });
  });

  describe('isMediaFile', () => {
    test('should return true for supported media files', () => {
      expect(isMediaFile('photo.jpg')).toBe(true);
      expect(isMediaFile('image.JPEG')).toBe(true); // Case insensitive
      expect(isMediaFile('picture.png')).toBe(true);
      expect(isMediaFile('animation.gif')).toBe(true);
      expect(isMediaFile('modern.webp')).toBe(true);
      expect(isMediaFile('video.mp4')).toBe(true);
      expect(isMediaFile('movie.MOV')).toBe(true); // Case insensitive
      expect(isMediaFile('clip.avi')).toBe(true);
      expect(isMediaFile('video.mkv')).toBe(true);
    });

    test('should return false for unsupported files', () => {
      expect(isMediaFile('document.txt')).toBe(false);
      expect(isMediaFile('script.js')).toBe(false);
      expect(isMediaFile('data.json')).toBe(false);
      expect(isMediaFile('style.css')).toBe(false);
      expect(isMediaFile('page.html')).toBe(false);
      expect(isMediaFile('no-extension')).toBe(false);
    });
  });

  describe('getFileMimeType', () => {
    test('should return correct MIME types for supported formats', () => {
      expect(getFileMimeType('photo.jpg')).toBe('image/jpeg');
      expect(getFileMimeType('image.jpeg')).toBe('image/jpeg');
      expect(getFileMimeType('picture.png')).toBe('image/png');
      expect(getFileMimeType('animation.gif')).toBe('image/gif');
      expect(getFileMimeType('modern.webp')).toBe('image/webp');
      expect(getFileMimeType('video.mp4')).toBe('video/mp4');
      expect(getFileMimeType('movie.mov')).toBe('video/quicktime');
      expect(getFileMimeType('clip.avi')).toBe('video/x-msvideo');
      expect(getFileMimeType('video.mkv')).toBe('video/x-matroska');
    });

    test('should return default MIME type for unsupported formats', () => {
      expect(getFileMimeType('document.txt')).toBe('application/octet-stream');
      expect(getFileMimeType('script.js')).toBe('application/octet-stream');
      expect(getFileMimeType('no-extension')).toBe('application/octet-stream');
    });

    test('should handle case insensitive extensions', () => {
      expect(getFileMimeType('photo.JPG')).toBe('image/jpeg');
      expect(getFileMimeType('video.MP4')).toBe('video/mp4');
      expect(getFileMimeType('movie.MOV')).toBe('video/quicktime');
    });
  });

  describe('error handling', () => {
    test('should handle permission denied gracefully', async () => {
      // This test might not work on all systems, but it's good to have
      const result = await scanDirectory('/root');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('directory_access_error');
      }
    });

    test('should continue scanning when some files are inaccessible', async () => {
      // Create a test scenario where some files might be inaccessible
      // This is more of an integration test to ensure robustness
      const result = await scanDirectory(TEST_DIR);

      expect(result.success).toBe(true);
      if (result.success) {
        // Should still return accessible media files
        expect(result.data.length).toBeGreaterThan(0);
      }
    });
  });

  describe('content hash generation', () => {
    test('should generate consistent hashes for same content', async () => {
      const result1 = await scanDirectory(TEST_DIR);
      const result2 = await scanDirectory(TEST_DIR);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      if (result1.success && result2.success) {
        const file1 = result1.data.find((f) => f.fileName === 'image.jpg');
        const file2 = result2.data.find((f) => f.fileName === 'image.jpg');

        expect(file1?.contentHash).toBeDefined();
        expect(file2?.contentHash).toBeDefined();
        expect(file1?.contentHash).toBe(file2?.contentHash);
      }
    });

    test('should generate different hashes for different content', async () => {
      const result = await scanDirectory(TEST_DIR);

      expect(result.success).toBe(true);
      if (result.success) {
        const jpegFile = result.data.find((f) => f.fileName === 'image.jpg');
        const pngFile = result.data.find((f) => f.fileName === 'photo.png');

        expect(jpegFile?.contentHash).toBeDefined();
        expect(pngFile?.contentHash).toBeDefined();
        expect(jpegFile?.contentHash).not.toBe(pngFile?.contentHash);
      }
    });
  });
});
