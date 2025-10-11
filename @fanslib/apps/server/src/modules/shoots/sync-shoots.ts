import { Effect } from 'effect';
import { dirname } from 'path';
import type { FileMetadata } from '../files/extract-metadata';
import { parseShootFromFolderPath, type ShootInfo } from './parse-shoot';
import { upsertShoot } from './upsert-shoot';

export const syncShoot = Effect.fn('syncShoot')(function* (file: FileMetadata) {
  const shoot = parseShootFromFolderPath(dirname(file.absolutePath));
  if (!shoot) return;

  return yield* upsertShoot(shoot);
});

const collectShoots = (files: FileMetadata[]): Set<ShootInfo> =>
  files.reduce((shoots, file) => {
    const shoot = parseShootFromFolderPath(dirname(file.absolutePath));
    if (!shoot) return shoots;

    shoots.add(shoot);
    return shoots;
  }, new Set<ShootInfo>());

export const syncShoots = Effect.fn('syncShoots')(function* (
  files: FileMetadata[]
) {
  const shoots = collectShoots(files);
  return yield* Effect.validateAll(shoots, upsertShoot);
});
