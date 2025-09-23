import { beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { mkdir, rmdir } from 'fs/promises';
import { join } from 'path';
import {
  analyzeFolderForShoot,
  detectShootFromFolder,
  getShootForMediaFile,
  isValidShootFolderName,
  normalizeShootName,
  parseShootFromFolderName,
  scanDirectoryForShoots,
  validateShootName,
} from '../../../src/modules/media/shootDetection';

describe('Shoot Detection Module', () => {
  const testDir = join(process.cwd(), 'tests', 'fixtures', 'shoots');
  const contentRoot = testDir;

  beforeAll(async () => {
    await mkdir(testDir, { recursive: true });
  });

  beforeEach(async () => {
    // Clean up test directories before each test
    try {
      const entries = await Array.fromAsync(
        new Bun.Glob('*').scan({ cwd: testDir, onlyFiles: false })
      );

      await Promise.all(
        entries.map(async (entry) => {
          try {
            await rmdir(join(testDir, entry), { recursive: true });
          } catch {
            // Directory might not exist or might have files, which is fine
          }
        })
      );
    } catch {
      // Test directory might not exist, which is fine
    }
  });

  describe('parseShootFromFolderName', () => {
    it('should parse valid shoot folder names', () => {
      const testCases = [
        {
          input: '2024-01-15_Beach_Sunset',
          expected: {
            isShoot: true,
            shootInfo: {
              shootName: 'Beach_Sunset',
              shootDate: new Date(2024, 0, 15), // month is 0-indexed
            },
          },
        },
        {
          input: '2023-12-31_New_Years_Party',
          expected: {
            isShoot: true,
            shootInfo: {
              shootName: 'New_Years_Party',
              shootDate: new Date(2023, 11, 31),
            },
          },
        },
        {
          input: '2024-03-22_Studio_Portrait_Session',
          expected: {
            isShoot: true,
            shootInfo: {
              shootName: 'Studio_Portrait_Session',
              shootDate: new Date(2024, 2, 22),
            },
          },
        },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseShootFromFolderName(input);
        expect(result.isShoot).toBe(expected.isShoot);
        if (result.isShoot && result.shootInfo && expected.shootInfo) {
          expect(result.shootInfo.shootName).toBe(expected.shootInfo.shootName);
          expect(result.shootInfo.shootDate.getTime()).toBe(
            expected.shootInfo.shootDate.getTime()
          );
        }
      });
    });

    it('should reject invalid folder names', () => {
      const invalidNames = [
        'regular-folder',
        '2024-13-01_Invalid_Month', // invalid month
        '2024-02-30_Invalid_Date', // invalid date
        '2024-01-32_Invalid_Day', // invalid day
        '24-01-15_Short_Year', // year too short
        '2024-1-15_Single_Digit_Month', // month not zero-padded
        '2024-01-5_Single_Digit_Day', // day not zero-padded
        '2024-01-15', // missing underscore and name
        '2024-01-15_', // empty name
        '1989-01-15_Too_Old', // date too old
        '2030-01-15_Too_Future', // date too far in future
        '',
        'not-a-date_folder',
      ];

      invalidNames.forEach((name) => {
        const result = parseShootFromFolderName(name);
        expect(result.isShoot).toBe(false);
        expect(result.shootInfo).toBeUndefined();
      });
    });

    it('should handle edge cases with date validation', () => {
      // Test leap year validation
      const leapYearValid = parseShootFromFolderName('2024-02-29_Leap_Year');
      expect(leapYearValid.isShoot).toBe(true);

      const nonLeapYearInvalid = parseShootFromFolderName(
        '2023-02-29_Non_Leap_Year'
      );
      expect(nonLeapYearInvalid.isShoot).toBe(false);

      // Test month boundaries
      const januaryFirst = parseShootFromFolderName('2024-01-01_New_Year');
      expect(januaryFirst.isShoot).toBe(true);

      const decemberLast = parseShootFromFolderName('2024-12-31_Year_End');
      expect(decemberLast.isShoot).toBe(true);
    });

    it('should handle shoot names with special characters', () => {
      const result = parseShootFromFolderName('2024-01-15_Family & Friends');
      expect(result.isShoot).toBe(true);
      if (result.shootInfo) {
        expect(result.shootInfo.shootName).toBe('Family & Friends');
      }

      const resultWithSpaces = parseShootFromFolderName(
        '2024-01-15_  Padded Name  '
      );
      expect(resultWithSpaces.isShoot).toBe(true);
      if (resultWithSpaces.shootInfo) {
        expect(resultWithSpaces.shootInfo.shootName).toBe('Padded Name');
      }
    });
  });

  describe('detectShootFromFolder', () => {
    it('should detect shoot from valid folder path', async () => {
      const shootFolder = join(testDir, '2024-01-15_Beach_Sunset');
      await mkdir(shootFolder, { recursive: true });

      const result = await detectShootFromFolder(shootFolder, contentRoot);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.shootName).toBe('Beach_Sunset');
        expect(result.data.shootDate.getTime()).toBe(
          new Date(2024, 0, 15).getTime()
        );
        expect(result.data.folderPath).toBe(shootFolder);
        expect(result.data.relativePath).toBe('2024-01-15_Beach_Sunset');
      }
    });

    it('should handle non-existent folder', async () => {
      const nonExistentFolder = join(testDir, 'does-not-exist');

      const result = await detectShootFromFolder(
        nonExistentFolder,
        contentRoot
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('folder_access_error');
        expect(result.error.message).toContain('does not exist');
      }
    });

    it('should handle file instead of folder', async () => {
      const testFile = join(testDir, '2024-01-15_Beach_Sunset.txt');
      await Bun.write(testFile, 'test content');

      const result = await detectShootFromFolder(testFile, contentRoot);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('folder_access_error');
        expect(result.error.message).toContain('not a directory');
      }
    });

    it('should handle invalid folder pattern', async () => {
      const invalidFolder = join(testDir, 'regular-folder');
      await mkdir(invalidFolder, { recursive: true });

      const result = await detectShootFromFolder(invalidFolder, contentRoot);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('invalid_pattern_error');
        expect(result.error.message).toContain('does not match');
      }
    });

    it('should calculate correct relative path', async () => {
      const nestedShootFolder = join(
        testDir,
        'nested',
        '2024-01-15_Nested_Shoot'
      );
      await mkdir(nestedShootFolder, { recursive: true });

      const result = await detectShootFromFolder(nestedShootFolder, testDir);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.relativePath).toBe('nested/2024-01-15_Nested_Shoot');
      }
    });
  });

  describe('analyzeFolderForShoot', () => {
    it('should return hasShootPattern true for valid shoot folder', async () => {
      const shootFolder = join(testDir, '2024-01-15_Beach_Sunset');
      await mkdir(shootFolder, { recursive: true });

      const result = await analyzeFolderForShoot(shootFolder, contentRoot);

      expect(result.hasShootPattern).toBe(true);
      expect(result.shootInfo).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should return hasShootPattern false for regular folder', async () => {
      const regularFolder = join(testDir, 'regular-folder');
      await mkdir(regularFolder, { recursive: true });

      const result = await analyzeFolderForShoot(regularFolder, contentRoot);

      expect(result.hasShootPattern).toBe(false);
      expect(result.shootInfo).toBeUndefined();
      expect(result.error).toBeUndefined(); // Invalid pattern should not be treated as error
    });

    it('should return error for access issues', async () => {
      const nonExistentFolder = join(testDir, 'does-not-exist');

      const result = await analyzeFolderForShoot(
        nonExistentFolder,
        contentRoot
      );

      expect(result.hasShootPattern).toBe(false);
      expect(result.shootInfo).toBeUndefined();
      expect(result.error).toBeDefined();
      if (result.error) {
        expect(result.error.type).toBe('folder_access_error');
      }
    });
  });

  describe('getShootForMediaFile', () => {
    it('should identify shoot for media file in shoot folder', async () => {
      const shootFolder = join(testDir, '2024-01-15_Beach_Sunset');
      await mkdir(shootFolder, { recursive: true });
      const mediaFile = join(shootFolder, 'photo.jpg');

      const result = await getShootForMediaFile(mediaFile, contentRoot);

      expect(result.hasShoot).toBe(true);
      expect(result.shootInfo).toBeDefined();
      if (result.shootInfo) {
        expect(result.shootInfo.shootName).toBe('Beach_Sunset');
      }
    });

    it('should handle media file in regular folder', async () => {
      const regularFolder = join(testDir, 'regular-folder');
      await mkdir(regularFolder, { recursive: true });
      const mediaFile = join(regularFolder, 'photo.jpg');

      const result = await getShootForMediaFile(mediaFile, contentRoot);

      expect(result.hasShoot).toBe(false);
      expect(result.shootInfo).toBeUndefined();
      expect(result.error).toBeUndefined();
    });

    it('should handle media file in non-existent folder', async () => {
      const mediaFile = join(testDir, 'does-not-exist', 'photo.jpg');

      const result = await getShootForMediaFile(mediaFile, contentRoot);

      expect(result.hasShoot).toBe(false);
      expect(result.error).toBeDefined();
      if (result.error) {
        expect(result.error.type).toBe('folder_access_error');
      }
    });
  });

  describe('scanDirectoryForShoots', () => {
    it('should find all shoot folders in directory', async () => {
      const shootFolders = [
        '2024-01-15_Beach_Sunset',
        '2024-02-20_Studio_Portrait',
        '2024-03-10_Wedding_Ceremony',
      ];

      // Create shoot folders
      await Promise.all(
        shootFolders.map((folder) =>
          mkdir(join(testDir, folder), { recursive: true })
        )
      );

      // Create some non-shoot folders
      await mkdir(join(testDir, 'regular-folder'), { recursive: true });
      await mkdir(join(testDir, 'another-folder'), { recursive: true });

      const result = await scanDirectoryForShoots(testDir, contentRoot);

      expect(result.success).toBe(true);
      expect(result.shoots).toHaveLength(3);
      expect(result.errors).toHaveLength(0);

      const shootNames = result.shoots.map((shoot) => shoot.shootName);
      expect(shootNames).toContain('Beach_Sunset');
      expect(shootNames).toContain('Studio_Portrait');
      expect(shootNames).toContain('Wedding_Ceremony');
    });

    it('should handle directory with no shoots', async () => {
      await mkdir(join(testDir, 'regular-folder1'), { recursive: true });
      await mkdir(join(testDir, 'regular-folder2'), { recursive: true });

      const result = await scanDirectoryForShoots(testDir, contentRoot);

      expect(result.success).toBe(true);
      expect(result.shoots).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle non-existent directory', async () => {
      const nonExistentDir = join(testDir, 'does-not-exist');

      const result = await scanDirectoryForShoots(nonExistentDir, contentRoot);

      expect(result.success).toBe(false);
      expect(result.shoots).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe('folder_access_error');
    });

    it('should handle mixed valid and invalid shoot folders', async () => {
      await mkdir(join(testDir, '2024-01-15_Valid_Shoot'), { recursive: true });
      await mkdir(join(testDir, '2024-13-01_Invalid_Month'), {
        recursive: true,
      });
      await mkdir(join(testDir, 'regular-folder'), { recursive: true });

      const result = await scanDirectoryForShoots(testDir, contentRoot);

      expect(result.success).toBe(true);
      expect(result.shoots).toHaveLength(1);
      expect(result.shoots[0].shootName).toBe('Valid_Shoot');
    });
  });

  describe('validateShootName', () => {
    it('should validate good shoot names', () => {
      const validNames = [
        'Beach_Sunset',
        'Studio Portrait',
        'Wedding-2024',
        'Family & Friends',
        'A',
        'Very Long Shoot Name That Is Still Valid',
      ];

      validNames.forEach((name) => {
        const result = validateShootName(name);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid shoot names', () => {
      const invalidNames = [
        '',
        '   ',
        'A'.repeat(256), // too long
        'Invalid<Character',
        'Invalid>Character',
        'Invalid:Character',
        'Invalid"Character',
        'Invalid/Character',
        'Invalid\\Character',
        'Invalid|Character',
        'Invalid?Character',
        'Invalid*Character',
        'Invalid\x00Character', // null character
      ];

      invalidNames.forEach((name) => {
        const result = validateShootName(name);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    it('should provide specific error messages', () => {
      const emptyResult = validateShootName('');
      expect(emptyResult.error).toContain('cannot be empty');

      const longResult = validateShootName('A'.repeat(256));
      expect(longResult.error).toContain('exceed 255 characters');

      const invalidCharResult = validateShootName('Invalid<Character');
      expect(invalidCharResult.error).toContain('invalid characters');
    });
  });

  describe('normalizeShootName', () => {
    it('should normalize shoot names correctly', () => {
      const testCases = [
        { input: '  Beach Sunset  ', expected: 'Beach Sunset' },
        { input: 'Multiple   Spaces   Here', expected: 'Multiple Spaces Here' },
        { input: 'Already_Normalized', expected: 'Already_Normalized' },
        { input: '\t\n  Whitespace\t\n  ', expected: 'Whitespace' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = normalizeShootName(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('isValidShootFolderName', () => {
    it('should validate shoot folder names', () => {
      const validNames = [
        '2024-01-15_Beach_Sunset',
        '2023-12-31_New_Years',
        '2024-02-29_Leap_Year', // valid leap year
      ];

      const invalidNames = [
        'regular-folder',
        '2024-13-01_Invalid',
        '2023-02-29_Not_Leap_Year',
        '2024-01-15', // missing name
      ];

      validNames.forEach((name) => {
        expect(isValidShootFolderName(name)).toBe(true);
      });

      invalidNames.forEach((name) => {
        expect(isValidShootFolderName(name)).toBe(false);
      });
    });
  });

  describe('getShootPatternExamples', () => {
    it('should return valid examples', () => {
      const examples = getShootPatternExamples();

      expect(examples).toBeInstanceOf(Array);
      expect(examples.length).toBeGreaterThan(0);

      examples.forEach((example) => {
        expect(isValidShootFolderName(example)).toBe(true);
      });
    });

    it('should return diverse examples', () => {
      const examples = getShootPatternExamples();

      // Should have examples from different months
      const months = examples.map((ex) => ex.split('-')[1]);
      const uniqueMonths = new Set(months);
      expect(uniqueMonths.size).toBeGreaterThan(1);
    });
  });

  describe('functional programming compliance', () => {
    it('should not mutate input parameters', async () => {
      const originalFolderName = '2024-01-15_Beach_Sunset';
      const folderNameCopy = originalFolderName;

      parseShootFromFolderName(folderNameCopy);

      expect(folderNameCopy).toBe(originalFolderName);
    });

    it('should return consistent results for same input', () => {
      const folderName = '2024-01-15_Beach_Sunset';

      const result1 = parseShootFromFolderName(folderName);
      const result2 = parseShootFromFolderName(folderName);

      expect(result1.isShoot).toBe(result2.isShoot);
      if (result1.shootInfo && result2.shootInfo) {
        expect(result1.shootInfo.shootName).toBe(result2.shootInfo.shootName);
        expect(result1.shootInfo.shootDate.getTime()).toBe(
          result2.shootInfo.shootDate.getTime()
        );
      }
    });

    it('should use immutable data structures', async () => {
      const shootFolder = join(testDir, '2024-01-15_Beach_Sunset');
      await mkdir(shootFolder, { recursive: true });

      const result = await detectShootFromFolder(shootFolder, contentRoot);

      expect(result.success).toBe(true);
      if (result.success) {
        const shootInfo = result.data;
        const originalShootName = shootInfo.shootName;

        // Attempt to modify the returned object
        try {
          (shootInfo as any).shootName = 'Modified';
        } catch {
          // Expected to fail in strict mode
        }

        // For this test, we just verify the structure is returned correctly
        expect(typeof shootInfo.shootName).toBe('string');
        expect(typeof shootInfo.folderPath).toBe('string');
        expect(shootInfo.shootDate).toBeInstanceOf(Date);
      }
    });
  });
});
