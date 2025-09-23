import { shootsTable, type CreateShoot, type Shoot } from '@fanslib/db';
import { eq } from 'drizzle-orm';
import { db } from '../../db/connection';
import type { ShootInfo } from './shootDetection';

export type ShootSyncError = {
  type: 'database_error' | 'validation_error' | 'duplicate_error';
  message: string;
  shootPath: string;
};

export type DatabaseShoot = Shoot;

/**
 * Gets existing shoot by folder path
 */
const getExistingShootByPath = async (
  folderPath: string
): Promise<DatabaseShoot | null> => {
  const existingShoot = await db
    .select()
    .from(shootsTable)
    .where(eq(shootsTable.folderpath, folderPath))
    .limit(1);

  return existingShoot.length > 0 ? (existingShoot[0] as DatabaseShoot) : null;
};

/**
 * Creates shoot data object from shoot info
 */
const createShootData = (shootInfo: ShootInfo): CreateShoot => ({
  name: shootInfo.shootName,
  date: new Date(shootInfo.shootDate),
  folderpath: shootInfo.folderPath,
});

/**
 * Updates an existing shoot
 */
const updateExistingShoot = async (
  existingShootId: number,
  shootData: ReturnType<typeof createShootData>
): Promise<
  | { success: true; data: DatabaseShoot }
  | { success: false; error: ShootSyncError }
> => {
  try {
    const updated = await db
      .update(shootsTable)
      .set(shootData)
      .where(eq(shootsTable.id, existingShootId))
      .returning();

    if (updated.length === 0) {
      return {
        success: false,
        error: {
          type: 'database_error',
          message: 'Failed to update existing shoot',
          shootPath: 'unknown',
        },
      };
    }

    return {
      success: true,
      data: updated[0] as DatabaseShoot,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message:
          error instanceof Error ? error.message : 'Failed to update shoot',
        shootPath: 'unknown',
      },
    };
  }
};

/**
 * Creates a new shoot
 */
const createNewShoot = async (
  shootInfo: ShootInfo,
  shootData: ReturnType<typeof createShootData>
): Promise<
  | { success: true; data: DatabaseShoot }
  | { success: false; error: ShootSyncError }
> => {
  try {
    const now = new Date();
    const inserted = await db
      .insert(shootsTable)
      .values({
        ...shootData,
        folderpath: shootInfo.folderPath,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (inserted.length === 0) {
      return {
        success: false,
        error: {
          type: 'database_error',
          message: 'Failed to create new shoot',
          shootPath: shootInfo.folderPath,
        },
      };
    }

    return {
      success: true,
      data: inserted[0] as DatabaseShoot,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message:
          error instanceof Error ? error.message : 'Failed to create shoot',
        shootPath: shootInfo.folderPath,
      },
    };
  }
};

/**
 * Creates or updates a shoot in the database
 */
export const upsertShoot = async (
  shootInfo: ShootInfo
): Promise<
  | { success: true; data: DatabaseShoot }
  | { success: false; error: ShootSyncError }
> => {
  try {
    const existingShoot = await getExistingShootByPath(shootInfo.folderPath);
    const shootData = createShootData(shootInfo);

    if (existingShoot) {
      return await updateExistingShoot(existingShoot.id, shootData);
    }

    return await createNewShoot(shootInfo, shootData);
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message:
          error instanceof Error ? error.message : 'Unknown database error',
        shootPath: shootInfo.folderPath,
      },
    };
  }
};

/**
 * Gets all shoots from database with error handling
 */
const getAllShootsFromDatabase = async (): Promise<DatabaseShoot[]> => {
  const allShoots = await db
    .select()
    .from(shootsTable)
    .orderBy(shootsTable.date);

  return allShoots as DatabaseShoot[];
};

/**
 * Gets all shoots from database
 */
export const getAllShoots = async (): Promise<
  { success: true; data: DatabaseShoot[] } | { success: false; error: string }
> => {
  try {
    const data = await getAllShootsFromDatabase();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get all shoots',
    };
  }
};
