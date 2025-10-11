import { describe, expect, it } from 'bun:test';
import { Effect, Ref } from 'effect';
import {
  ScanInProgressError,
  ScanStatus,
  initialScanStatus,
  initializeScanFiles,
  isScanInProgress,
  resetScanStatus,
  startScan,
  stopScan,
  updateFileStatus,
} from './scan-status';

const runWithScanStatus = <A>(effect: Effect.Effect<A, unknown, ScanStatus>) =>
  Effect.runSync(
    effect.pipe(Effect.provideServiceEffect(ScanStatus, initialScanStatus()))
  );

describe('ScanStatus', () => {
  describe('initialScanStatus', () => {
    it('should create initial scan status with correct defaults', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;
          return yield* Ref.get(statusRef);
        })
      );

      expect(result.isScanning).toBe(false);
      expect(result.files).toBeInstanceOf(Map);
      expect(result.files.size).toBe(0);
    });
  });

  describe('resetScanStatus', () => {
    it('should reset scan status to initial state', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* startScan();
          yield* initializeScanFiles(['file1.txt', 'file2.txt']);
          yield* resetScanStatus();

          return yield* Ref.get(statusRef);
        })
      );
      expect(result.isScanning).toBe(false);
      expect(result.files.size).toBe(0);
    });
  });

  describe('startScan', () => {
    it('should set scanning to true and clear files', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* initializeScanFiles(['file1.txt']);
          yield* startScan();

          return yield* Ref.get(statusRef);
        })
      );
      expect(result.isScanning).toBe(true);
      expect(result.files.size).toBe(0);
    });

    it('should throw ScanInProgressError when scan already running', () => {
      const effect = Effect.gen(function* () {
        yield* startScan();
        return yield* Effect.flip(startScan()); // Flip to get the error
      });

      const error = runWithScanStatus(effect);
      expect(error).toBeInstanceOf(ScanInProgressError);
    });
  });

  describe('stopScan', () => {
    it('should set scanning to false while preserving files', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* startScan();
          yield* initializeScanFiles(['file1.txt']);
          yield* stopScan();

          return yield* Ref.get(statusRef);
        })
      );

      expect(result.isScanning).toBe(false);
      expect(result.files.size).toBe(1);
      expect(result.files.get('file1.txt')).toEqual({ status: 'pending' });
    });
  });

  describe('initializeScanFiles', () => {
    it('should initialize files with pending status', () => {
      const files = ['file1.txt', 'file2.txt', 'file3.txt'];

      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* initializeScanFiles(files);

          return yield* Ref.get(statusRef);
        })
      );

      expect(result.files.size).toBe(3);
      files.forEach((file) => {
        expect(result.files.get(file)).toEqual({ status: 'pending' });
      });
    });

    it('should replace existing files', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* initializeScanFiles(['file1.txt', 'file2.txt']);
          yield* initializeScanFiles(['file3.txt']);

          return yield* Ref.get(statusRef);
        })
      );

      expect(result.files.size).toBe(1);
      expect(result.files.get('file3.txt')).toEqual({ status: 'pending' });
      expect(result.files.has('file1.txt')).toBe(false);
      expect(result.files.has('file2.txt')).toBe(false);
    });
  });

  describe('updateFileStatus', () => {
    it('should update status of existing file', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* initializeScanFiles(['file1.txt']);
          yield* updateFileStatus('file1.txt', { status: 'metadataExtracted' });

          return yield* Ref.get(statusRef);
        })
      );

      expect(result.files.get('file1.txt')).toEqual({
        status: 'metadataExtracted',
      });
    });

    it('should update file status with error', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* initializeScanFiles(['file1.txt']);
          yield* updateFileStatus('file1.txt', {
            status: 'error',
            error: 'Failed to process',
          });

          return yield* Ref.get(statusRef);
        })
      );

      expect(result.files.get('file1.txt')).toEqual({
        status: 'error',
        error: 'Failed to process',
      });
    });

    it('should handle multiple status updates on same file', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* initializeScanFiles(['file1.txt']);
          yield* updateFileStatus('file1.txt', { status: 'metadataExtracted' });
          yield* updateFileStatus('file1.txt', {
            status: 'thumbnailGenerated',
          });
          yield* updateFileStatus('file1.txt', { status: 'databaseUpdated' });
          return yield* Ref.get(statusRef);
        })
      );

      expect(result.files.get('file1.txt')).toEqual({
        status: 'databaseUpdated',
      });
    });

    it('should ignore updates for non-existent files', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* initializeScanFiles(['file1.txt']);
          const updateResult = yield* updateFileStatus('nonexistent.txt', {
            status: 'metadataExtracted',
          });

          const status = yield* Ref.get(statusRef);
          return { status, updateResult };
        })
      );

      expect(result.status.files.size).toBe(1);
      expect(result.status.files.has('nonexistent.txt')).toBe(false);
      expect(result.updateResult._tag).toBe('None');
    });
  });

  describe('isScanInProgress', () => {
    it('should return false initially', () => {
      const result = runWithScanStatus(isScanInProgress());
      expect(result).toBe(false);
    });

    it('should return true when scan is started', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          yield* startScan();
          return yield* isScanInProgress();
        })
      );

      expect(result).toBe(true);
    });

    it('should return false after scan is stopped', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          yield* startScan();
          yield* stopScan();
          return yield* isScanInProgress();
        })
      );

      expect(result).toBe(false);
    });
  });

  describe('integration workflows', () => {
    it('should handle complete scan workflow', () => {
      const files = ['file1.txt', 'file2.txt'];

      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* startScan();
          expect(yield* isScanInProgress()).toBe(true);

          yield* initializeScanFiles(files);

          yield* updateFileStatus('file1.txt', { status: 'metadataExtracted' });
          yield* updateFileStatus('file2.txt', {
            status: 'error',
            error: 'Processing failed',
          });
          yield* updateFileStatus('file1.txt', { status: 'databaseUpdated' });

          yield* stopScan();

          return yield* Ref.get(statusRef);
        })
      );

      expect(result.isScanning).toBe(false);
      expect(result.files.get('file1.txt')).toEqual({
        status: 'databaseUpdated',
      });
      expect(result.files.get('file2.txt')).toEqual({
        status: 'error',
        error: 'Processing failed',
      });
    });

    it('should handle scan reset workflow', () => {
      const result = runWithScanStatus(
        Effect.gen(function* () {
          const statusRef = yield* ScanStatus;

          yield* startScan();
          yield* initializeScanFiles(['file1.txt']);
          yield* updateFileStatus('file1.txt', { status: 'metadataExtracted' });

          // Reset everything
          yield* resetScanStatus();

          return yield* Ref.get(statusRef);
        })
      );

      expect(result.isScanning).toBe(false);
      expect(result.files.size).toBe(0);
    });
  });
});
