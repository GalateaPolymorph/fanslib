import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';

export const TEST_DIR = join(process.cwd(), 'test-media-library');
export const NESTED_DIR = join(TEST_DIR, '2024-01-15_vacation');
export const MIXED_DIR = join(TEST_DIR, 'mixed-content');

// Test file content for different formats
export const TEST_FILES = {
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
} as const;

export const setupTestDirectory = async (): Promise<void> => {
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

export const cleanupTestDirectory = async (): Promise<void> => {
  try {
    await rm(TEST_DIR, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
};

export const createEmptyDirectory = async (name: string): Promise<string> => {
  const emptyDir = join(TEST_DIR, name);
  await mkdir(emptyDir, { recursive: true });
  return emptyDir;
};
