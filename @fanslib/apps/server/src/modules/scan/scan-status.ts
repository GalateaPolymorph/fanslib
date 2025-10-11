import { Context, Data, Effect, Ref } from 'effect';

type FilePath = string;
type FileStatus =
  | {
      status:
        | 'pending'
        | 'metadataExtracted'
        | 'thumbnailGenerated'
        | 'databaseUpdated'
        | undefined;
    }
  | {
      status: 'error';
      error: string;
    };

export type ScanStatusType = {
  isScanning: boolean;
  files: Map<FilePath, FileStatus>;
};

export class ScanStatus extends Context.Tag('ScanStatus')<
  ScanStatus,
  Ref.Ref<ScanStatusType>
>() {}

export class ScanInProgressError extends Data.TaggedError(
  'ScanInProgressError'
)<{}> {}

export const initialScanStatus = () =>
  Ref.make({
    isScanning: false,
    files: new Map<FilePath, FileStatus>(),
  });

export const resetScanStatus = Effect.fn('resetScanStatus')(function* () {
  const status = yield* ScanStatus;
  yield* Ref.set(status, {
    isScanning: false,
    files: new Map<FilePath, FileStatus>(),
  });
});

export const startScan = Effect.fn('startScan')(function* () {
  const status = yield* ScanStatus;

  const currentStatus = yield* Ref.get(status);
  if (currentStatus.isScanning) {
    return yield* Effect.fail(new ScanInProgressError());
  }

  yield* Ref.set(status, {
    isScanning: true,
    files: new Map<FilePath, FileStatus>(),
  });

  yield* Effect.log('Scan started');
});

export const stopScan = Effect.fn('stopScan')(function* () {
  const status = yield* ScanStatus;
  yield* Ref.update(status, (s) => ({
    ...s,
    isScanning: false,
  }));

  yield* Effect.log('Scan stopped');
});

export const initializeScanFiles = Effect.fn('initializeScanFiles')(function* (
  files: FilePath[]
) {
  const status = yield* ScanStatus;
  const filesMap = new Map(
    files.map((file) => [file, { status: 'pending' as const }])
  );

  yield* Ref.update(status, (s) => ({
    ...s,
    files: filesMap,
  }));
});

export const updateFileStatus = Effect.fn('updateFileStatus')(function* (
  file: FilePath,
  newFileStatus: FileStatus
) {
  const scanStatus = yield* ScanStatus;

  const currentScanStatus = yield* Ref.get(scanStatus);

  const currentFile = currentScanStatus.files.get(file);

  if (!currentFile) {
    // Ignore file if it's not in the scan list
    return yield* Effect.succeedNone;
  }

  currentScanStatus.files.set(file, newFileStatus);

  yield* Ref.update(scanStatus, (s) => ({
    ...s,
    files: currentScanStatus.files,
  }));

  return yield* Effect.succeedNone;
});

export const isScanInProgress = Effect.fn('isScanInProgress')(function* () {
  const status = yield* ScanStatus;
  const currentStatus = yield* Ref.get(status);
  return currentStatus.isScanning;
});
