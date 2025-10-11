import { describe, expect, test } from 'bun:test';
import {
  getMimeTypeFromExtension,
  isImageFile,
  isSupportedFormat,
  isVideoFile,
} from './formats.js';

describe('formats', () => {
  describe('isSupportedFormat', () => {
    test('should return true for supported image formats', () => {
      expect(isSupportedFormat('photo.jpg')).toBe(true);
      expect(isSupportedFormat('image.jpeg')).toBe(true);
      expect(isSupportedFormat('picture.png')).toBe(true);
      expect(isSupportedFormat('animation.gif')).toBe(true);
      expect(isSupportedFormat('modern.webp')).toBe(true);
    });

    test('should return true for supported video formats', () => {
      expect(isSupportedFormat('movie.mp4')).toBe(true);
      expect(isSupportedFormat('clip.mov')).toBe(true);
      expect(isSupportedFormat('video.avi')).toBe(true);
      expect(isSupportedFormat('stream.mkv')).toBe(true);
    });

    test('should handle case-insensitive extensions', () => {
      expect(isSupportedFormat('PHOTO.JPG')).toBe(true);
      expect(isSupportedFormat('Image.PNG')).toBe(true);
      expect(isSupportedFormat('VIDEO.MP4')).toBe(true);
      expect(isSupportedFormat('Movie.MOV')).toBe(true);
    });

    test('should return false for unsupported formats', () => {
      expect(isSupportedFormat('document.txt')).toBe(false);
      expect(isSupportedFormat('script.js')).toBe(false);
      expect(isSupportedFormat('archive.zip')).toBe(false);
      expect(isSupportedFormat('audio.mp3')).toBe(false);
      expect(isSupportedFormat('presentation.ppt')).toBe(false);
    });

    test('should return false for files without extensions', () => {
      expect(isSupportedFormat('filename')).toBe(false);
      expect(isSupportedFormat('')).toBe(false);
    });

    test('should handle paths with multiple dots', () => {
      expect(isSupportedFormat('my.vacation.photo.jpg')).toBe(true);
      expect(isSupportedFormat('project.backup.file.txt')).toBe(false);
    });
  });

  describe('isImageFile', () => {
    test('should return true for image formats', () => {
      expect(isImageFile('photo.jpg')).toBe(true);
      expect(isImageFile('image.jpeg')).toBe(true);
      expect(isImageFile('picture.png')).toBe(true);
      expect(isImageFile('animation.gif')).toBe(true);
      expect(isImageFile('modern.webp')).toBe(true);
    });

    test('should return false for video formats', () => {
      expect(isImageFile('movie.mp4')).toBe(false);
      expect(isImageFile('clip.mov')).toBe(false);
      expect(isImageFile('video.avi')).toBe(false);
      expect(isImageFile('stream.mkv')).toBe(false);
    });

    test('should return false for non-media formats', () => {
      expect(isImageFile('document.txt')).toBe(false);
      expect(isImageFile('script.js')).toBe(false);
    });
  });

  describe('isVideoFile', () => {
    test('should return true for video formats', () => {
      expect(isVideoFile('movie.mp4')).toBe(true);
      expect(isVideoFile('clip.mov')).toBe(true);
      expect(isVideoFile('video.avi')).toBe(true);
      expect(isVideoFile('stream.mkv')).toBe(true);
    });

    test('should return false for non-image formats', () => {
      expect(isImageFile('movie.mp4')).toBe(false);
      expect(isImageFile('document.txt')).toBe(false);
    });
  });

  describe('getMimeTypeFromExtension', () => {
    test('should return correct MIME types for image formats', () => {
      expect(getMimeTypeFromExtension('photo.jpg')).toBe('image/jpeg');
      expect(getMimeTypeFromExtension('image.jpeg')).toBe('image/jpeg');
      expect(getMimeTypeFromExtension('picture.png')).toBe('image/png');
      expect(getMimeTypeFromExtension('animation.gif')).toBe('image/gif');
      expect(getMimeTypeFromExtension('modern.webp')).toBe('image/webp');
    });

    test('should return correct MIME types for video formats', () => {
      expect(getMimeTypeFromExtension('movie.mp4')).toBe('video/mp4');
      expect(getMimeTypeFromExtension('clip.mov')).toBe('video/quicktime');
    });

    test('should return default MIME type for unsupported formats', () => {
      expect(getMimeTypeFromExtension('document.txt')).toBe(
        'application/octet-stream'
      );
    });
  });

  describe('format integration', () => {
    test('should correctly identify format types for common extensions', () => {
      const imageFile = 'vacation.jpg';
      const videoFile = 'movie.mp4';

      expect(isSupportedFormat(imageFile)).toBe(true);
      expect(isImageFile(imageFile)).toBe(true);
      expect(isVideoFile(imageFile)).toBe(false);

      expect(isSupportedFormat(videoFile)).toBe(true);
      expect(isImageFile(videoFile)).toBe(false);
      expect(isVideoFile(videoFile)).toBe(true);
    });
  });

  test('should return false for unsupported formats', () => {
    expect(isSupportedFormat('document.txt')).toBe(false);
    expect(isSupportedFormat('script.js')).toBe(false);
    expect(isSupportedFormat('archive.zip')).toBe(false);
  });

  test('should return false for files without extensions', () => {
    expect(isSupportedFormat('filename')).toBe(false);
    expect(isSupportedFormat('')).toBe(false);
  });
});
