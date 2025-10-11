import { describe, expect, test } from 'bun:test';
import { thumbnailDimensions } from './thumbnail-dimensions.js';

describe('thumbnailDimensions', () => {
  describe('landscape images', () => {
    test('should scale down large landscape image proportionally with width as longest side', () => {
      const result = thumbnailDimensions(1920, 1080);

      expect(result.width).toBe(500);
      expect(result.height).toBe(281);
    });

    test('should not scale up small landscape image', () => {
      const result = thumbnailDimensions(400, 300);

      expect(result.width).toBe(400);
      expect(result.height).toBe(300);
    });

    test('should handle extreme landscape aspect ratio', () => {
      const result = thumbnailDimensions(2000, 500);

      expect(result.width).toBe(500);
      expect(result.height).toBe(125);
    });

    test('should handle landscape image at exactly 500px width', () => {
      const result = thumbnailDimensions(500, 300);

      expect(result.width).toBe(500);
      expect(result.height).toBe(300);
    });
  });

  describe('portrait images', () => {
    test('should scale down large portrait image proportionally with height as longest side', () => {
      const result = thumbnailDimensions(1080, 1920);

      expect(result.width).toBe(281);
      expect(result.height).toBe(500);
    });

    test('should not scale up small portrait image', () => {
      const result = thumbnailDimensions(300, 400);

      expect(result.width).toBe(300);
      expect(result.height).toBe(400);
    });

    test('should handle extreme portrait aspect ratio', () => {
      const result = thumbnailDimensions(500, 2000);

      expect(result.width).toBe(125);
      expect(result.height).toBe(500);
    });

    test('should handle portrait image at exactly 500px height', () => {
      const result = thumbnailDimensions(300, 500);

      expect(result.width).toBe(300);
      expect(result.height).toBe(500);
    });
  });

  describe('square images', () => {
    test('should scale down large square image proportionally', () => {
      const result = thumbnailDimensions(1000, 1000);

      expect(result.width).toBe(500);
      expect(result.height).toBe(500);
    });

    test('should not scale up small square image', () => {
      const result = thumbnailDimensions(300, 300);

      expect(result.width).toBe(300);
      expect(result.height).toBe(300);
    });

    test('should handle exactly 500x500 square image', () => {
      const result = thumbnailDimensions(500, 500);

      expect(result.width).toBe(500);
      expect(result.height).toBe(500);
    });
  });

  describe('edge cases', () => {
    test('should handle very small dimensions', () => {
      const result = thumbnailDimensions(1, 1);

      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
    });

    test('should handle single pixel wide landscape', () => {
      const result = thumbnailDimensions(1, 100);

      expect(result.width).toBe(1);
      expect(result.height).toBe(100);
    });

    test('should handle single pixel tall portrait', () => {
      const result = thumbnailDimensions(100, 1);

      expect(result.width).toBe(100);
      expect(result.height).toBe(1);
    });

    test('should handle very large dimensions maintaining aspect ratio', () => {
      const result = thumbnailDimensions(4000, 3000);

      expect(result.width).toBe(500);
      expect(result.height).toBe(375);
    });

    test('should handle ultra-wide aspect ratio', () => {
      const result = thumbnailDimensions(5000, 1000);

      expect(result.width).toBe(500);
      expect(result.height).toBe(100);
    });

    test('should handle ultra-tall aspect ratio', () => {
      const result = thumbnailDimensions(1000, 5000);

      expect(result.width).toBe(100);
      expect(result.height).toBe(500);
    });
  });

  describe('common photo dimensions', () => {
    test('should handle 4K landscape (3840x2160)', () => {
      const result = thumbnailDimensions(3840, 2160);

      expect(result.width).toBe(500);
      expect(result.height).toBe(281);
    });

    test('should handle Full HD landscape (1920x1080)', () => {
      const result = thumbnailDimensions(1920, 1080);

      expect(result.width).toBe(500);
      expect(result.height).toBe(281);
    });

    test('should handle iPhone portrait (1284x2778)', () => {
      const result = thumbnailDimensions(1284, 2778);

      expect(result.width).toBe(231);
      expect(result.height).toBe(500);
    });

    test('should handle Instagram square (1080x1080)', () => {
      const result = thumbnailDimensions(1080, 1080);

      expect(result.width).toBe(500);
      expect(result.height).toBe(500);
    });

    test('should handle standard DSLR photo (6000x4000)', () => {
      const result = thumbnailDimensions(6000, 4000);

      expect(result.width).toBe(500);
      expect(result.height).toBe(333);
    });
  });

  describe('aspect ratio preservation', () => {
    test('should maintain aspect ratio for landscape images', () => {
      const originalWidth = 1600;
      const originalHeight = 900;
      const originalRatio = originalWidth / originalHeight;

      const result = thumbnailDimensions(originalWidth, originalHeight);
      const thumbnailRatio = result.width / result.height;

      expect(thumbnailRatio).toBeCloseTo(originalRatio, 2);
    });

    test('should maintain aspect ratio for portrait images', () => {
      const originalWidth = 900;
      const originalHeight = 1600;
      const originalRatio = originalWidth / originalHeight;

      const result = thumbnailDimensions(originalWidth, originalHeight);
      const thumbnailRatio = result.width / result.height;

      expect(thumbnailRatio).toBeCloseTo(originalRatio, 2);
    });

    test('should maintain aspect ratio for square images', () => {
      const originalWidth = 800;
      const originalHeight = 800;
      const originalRatio = originalWidth / originalHeight;

      const result = thumbnailDimensions(originalWidth, originalHeight);
      const thumbnailRatio = result.width / result.height;

      expect(thumbnailRatio).toBeCloseTo(originalRatio, 2);
    });
  });

  describe('scaling behavior', () => {
    test('should ensure longest side never exceeds 500px', () => {
      const testCases: [number, number][] = [
        [1920, 1080],
        [3840, 2160],
        [1080, 1920],
        [2160, 3840],
        [5000, 1000],
        [1000, 5000],
        [8000, 8000],
      ];

      testCases.forEach(([width, height]) => {
        const result = thumbnailDimensions(width, height);
        const longestSide = Math.max(result.width, result.height);
        expect(longestSide).toBeLessThanOrEqual(500);
      });
    });

    test('should not scale up images smaller than 500px', () => {
      const testCases: [number, number][] = [
        [400, 300],
        [300, 400],
        [100, 100],
        [450, 450],
        [250, 500],
        [500, 250],
      ];

      testCases.forEach(([width, height]) => {
        const result = thumbnailDimensions(width, height);
        expect(result.width).toBe(width);
        expect(result.height).toBe(height);
      });
    });
  });

  describe('return value structure', () => {
    test('should return object with width and height properties', () => {
      const result = thumbnailDimensions(1000, 800);

      expect(result).toHaveProperty('width');
      expect(result).toHaveProperty('height');
      expect(typeof result.width).toBe('number');
      expect(typeof result.height).toBe('number');
    });

    test('should return positive dimensions', () => {
      const result = thumbnailDimensions(1000, 800);

      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });

    test('should return integer dimensions', () => {
      const result = thumbnailDimensions(1920, 1080);

      expect(Number.isInteger(result.width)).toBe(true);
      expect(Number.isInteger(result.height)).toBe(true);
    });
  });
});
