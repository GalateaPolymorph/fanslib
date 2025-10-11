import { Config, Effect, pipe } from 'effect';
import { andThen, filter, flatMap, validateAll } from 'effect/Effect';
import { directoryExists } from './directory-exists.js';
import { extractFileMetadata, type FileMetadata } from './extract-metadata.js';
import { findAllFiles } from './find-all-files.js';
import { isFileSupported } from './formats.js';

const extractMetadataForFiles = (mediaRoot: string) => (mediaFiles: string[]) =>
  validateAll(mediaFiles, (filePath) =>
    extractFileMetadata(mediaRoot, filePath)
  );

const logFiles = (files: FileMetadata[]) =>
  Effect.log(`Found ${files.length} files`);

export const scanMediaRoot = Effect.gen(function* () {
  const mediaRoot = yield* Config.string('MEDIA_ROOT');
  yield* Effect.log(`Scanning media root: ${mediaRoot}`);

  return yield* pipe(
    directoryExists(mediaRoot),
    andThen(() => findAllFiles(mediaRoot)),
    flatMap(filter(isFileSupported)),
    flatMap(extractMetadataForFiles(mediaRoot)),
    Effect.tap((files) => logFiles(files))
  );
});
