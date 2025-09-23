import { shootsTable } from '@fanslib/db';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../../db/connection';
import type { ShootInfo } from './shootDetection';
import {
  upsertShoot,
  type DatabaseShoot,
  type ShootSyncError,
} from './upsertShoot';

export type ShootSyncResult = {
  success: boolean;
  newShoots: number;
  updatedShoots: number;
  errors: ShootSyncError[];
};

/**
 * Checks if a shoot is new based on folder path
 */
const isNewShoot = async (folderPath: string): Promise<boolean> => {
  const existingShoot = await db
    .select()
    .from(shootsTable)
    .where(eq(shootsTable.folderpath, folderPath))
    .limit(1);

  return existingShoot.length === 0;
};

/**
 * Processes a single shoot and returns result with metadata
 */
const processSingleShoot = async (
  shootInfo: ShootInfo
): Promise<{
  success: boolean;
  isNew: boolean;
  shootId?: string;
  error?: ShootSyncError;
}> => {
  const isNew = await isNewShoot(shootInfo.folderPath);
  const result = await upsertShoot(shootInfo);

  if (result.success) {
    return {
      success: true,
      isNew,
      shootId: result.data.id.toString(),
    };
  }

  return {
    success: false,
    isNew,
    error: result.error,
  };
};

/**
 * Processes results from shoot operations
 */
const processShootResults = (
  results: Array<{
    success: boolean;
    isNew: boolean;
    shootId?: string;
    error?: ShootSyncError;
  }>
): {
  errors: ShootSyncError[];
  newShoots: string[];
  updatedShoots: string[];
} =>
  results.reduce(
    (acc, result) => {
      if (result.success && result.shootId) {
        if (result.isNew) {
          return {
            ...acc,
            newShoots: [...acc.newShoots, result.shootId],
          };
        }
        return {
          ...acc,
          updatedShoots: [...acc.updatedShoots, result.shootId],
        };
      }

      if (result.error) {
        return {
          ...acc,
          errors: [...acc.errors, result.error],
        };
      }

      return acc;
    },
    {
      errors: [] as ShootSyncError[],
      newShoots: [] as string[],
      updatedShoots: [] as string[],
    }
  );

/**
 * Creates batches from shoot infos
 */
const createShootBatches = (
  shootInfos: ShootInfo[],
  batchSize: number
): ShootInfo[][] =>
  Array.from({ length: Math.ceil(shootInfos.length / batchSize) }, (_, i) =>
    shootInfos.slice(i * batchSize, (i + 1) * batchSize)
  );

/**
 * Syncs shoots to database from scan results
 */
export const syncShootsToDatabase = async (
  shootInfos: ShootInfo[]
): Promise<ShootSyncResult> => {
  const BATCH_SIZE = 10;
  const batches = createShootBatches(shootInfos, BATCH_SIZE);

  const batchResults = await Promise.all(
    batches.map((batch) =>
      Promise.all(batch.map((shootInfo) => processSingleShoot(shootInfo)))
    )
  );

  const flatResults = batchResults.flat();
  const { errors, newShoots, updatedShoots } = processShootResults(flatResults);

  return {
    success: errors.length === 0,
    newShoots: newShoots.length,
    updatedShoots: updatedShoots.length,
    errors,
  };
};

/**
 * Gets shoot IDs that should be removed from database
 */
const getShootIdsToRemove = async (
  existingShootPaths: string[]
): Promise<number[]> => {
  const allDbShoots = await db
    .select({ id: shootsTable.id, folderpath: shootsTable.folderpath })
    .from(shootsTable);

  const existingPathsSet = new Set(existingShootPaths);

  return allDbShoots
    .filter(
      (dbShoot) =>
        dbShoot.folderpath && !existingPathsSet.has(dbShoot.folderpath)
    )
    .map((dbShoot) => dbShoot.id);
};

/**
 * Removes shoots in batches
 */
const removeShootsInBatches = async (
  shootIds: number[]
): Promise<{
  totalRemoved: number;
  errors: ShootSyncError[];
}> => {
  const BATCH_SIZE = 50;
  const removeBatches = Array.from(
    { length: Math.ceil(shootIds.length / BATCH_SIZE) },
    (_, i) => shootIds.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
  );

  const errors: ShootSyncError[] = [];

  const removeResults = await Promise.all(
    removeBatches.map(async (batch, batchIndex) => {
      try {
        await db.delete(shootsTable).where(inArray(shootsTable.id, batch));
        return { success: true, count: batch.length };
      } catch (error) {
        errors.push({
          type: 'database_error',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to remove shoot batch',
          shootPath: `batch-${batchIndex + 1}`,
        });
        return { success: false, count: 0 };
      }
    })
  );

  const totalRemoved = removeResults.reduce(
    (sum, result) => sum + (result.success ? result.count : 0),
    0
  );

  return { totalRemoved, errors };
};

/**
 * Removes shoots from database that no longer exist in file system
 */
export const cleanupRemovedShoots = async (
  existingShootPaths: string[]
): Promise<{
  success: boolean;
  removedCount: number;
  errors: ShootSyncError[];
}> => {
  try {
    const shootIdsToRemove = await getShootIdsToRemove(existingShootPaths);

    if (shootIdsToRemove.length === 0) {
      return { success: true, removedCount: 0, errors: [] };
    }

    const { totalRemoved, errors } =
      await removeShootsInBatches(shootIdsToRemove);

    return {
      success: errors.length === 0,
      removedCount: totalRemoved,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      removedCount: 0,
      errors: [
        {
          type: 'database_error',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to cleanup removed shoots',
          shootPath: 'cleanup-operation',
        },
      ],
    };
  }
};

/**
 * Gets a single shoot by folder path
 */
const getShootByFolderPath = async (
  folderPath: string
): Promise<DatabaseShoot | null> => {
  const result = await db
    .select()
    .from(shootsTable)
    .where(eq(shootsTable.folderpath, folderPath))
    .limit(1);

  return result.length > 0 ? (result[0] as DatabaseShoot) : null;
};

/**
 * Gets shoots by folder paths
 */
export const getShootsByFolderPaths = async (
  folderPaths: string[]
): Promise<{
  success: boolean;
  shoots: DatabaseShoot[];
  errors: ShootSyncError[];
}> => {
  try {
    const shoots = await Promise.all(
      folderPaths.map((folderPath) => getShootByFolderPath(folderPath))
    );

    const validShoots = shoots.filter(
      (shoot): shoot is DatabaseShoot => shoot !== null
    );

    return {
      success: true,
      shoots: validShoots,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      shoots: [],
      errors: [
        {
          type: 'database_error',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to get shoots by folder paths',
          shootPath: 'multiple-paths',
        },
      ],
    };
  }
};
