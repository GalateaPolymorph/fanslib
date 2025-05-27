import { In, Not } from "typeorm";
import { db } from "../../lib/db";
import { Media } from "../library/entity";
import { MediaTag, TagDefinition } from "./entity";

/**
 * Tag Drift Prevention Service
 * Provides validation and cleanup mechanisms to maintain data integrity
 * without using foreign key constraints
 */

/**
 * Validate that a TagDefinition exists before creating MediaTag entries
 */
export const validateTagDefinitionExists = async (tagDefinitionId: number): Promise<boolean> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);

  const exists = await repository.exists({ where: { id: tagDefinitionId } });
  return exists;
};

/**
 * Validate multiple TagDefinition IDs exist
 */
export const validateTagDefinitionsExist = async (
  tagDefinitionIds: number[]
): Promise<{
  valid: number[];
  invalid: number[];
}> => {
  if (tagDefinitionIds.length === 0) {
    return { valid: [], invalid: [] };
  }

  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);

  const existingTags = await repository.find({
    where: { id: In(tagDefinitionIds) },
    select: ["id"],
  });

  const validIds = existingTags.map((tag) => tag.id);
  const invalidIds = tagDefinitionIds.filter((id) => !validIds.includes(id));

  return { valid: validIds, invalid: invalidIds };
};

/**
 * Find orphaned MediaTag entries that reference non-existent TagDefinitions
 */
export const findOrphanedMediaTags = async (): Promise<MediaTag[]> => {
  const dataSource = await db();
  const mediaTagRepository = dataSource.getRepository(MediaTag);
  const tagDefinitionRepository = dataSource.getRepository(TagDefinition);

  // Get all valid TagDefinition IDs
  const validTagDefinitions = await tagDefinitionRepository.find({ select: ["id"] });
  const validTagDefinitionIds = validTagDefinitions.map((tag) => tag.id);

  if (validTagDefinitionIds.length === 0) {
    // If no valid tag definitions exist, all MediaTags are orphaned
    return mediaTagRepository.find();
  }

  // Find MediaTags that reference non-existent TagDefinitions
  const orphanedMediaTags = await mediaTagRepository.find({
    where: {
      tagDefinitionId: Not(In(validTagDefinitionIds)),
    },
  });

  return orphanedMediaTags;
};

/**
 * Clean up orphaned MediaTag entries
 */
export const cleanupOrphanedMediaTags = async (): Promise<{
  removedCount: number;
  removedIds: number[];
}> => {
  const orphanedTags = await findOrphanedMediaTags();

  if (orphanedTags.length === 0) {
    return { removedCount: 0, removedIds: [] };
  }

  const dataSource = await db();
  const repository = dataSource.getRepository(MediaTag);

  const removedIds = orphanedTags.map((tag) => tag.id);
  await repository.remove(orphanedTags);

  console.log(`🧹 Cleaned up ${orphanedTags.length} orphaned MediaTag entries`);

  return { removedCount: orphanedTags.length, removedIds };
};

/**
 * Validate MediaTag assignment data before creation
 */
export const validateMediaTagAssignment = async (dto: {
  mediaId: string;
  tagDefinitionIds: number[];
}): Promise<{
  isValid: boolean;
  errors: string[];
  validTagDefinitionIds: number[];
}> => {
  const errors: string[] = [];

  // Validate media exists
  const dataSource = await db();
  const mediaRepository = dataSource.getRepository(Media);

  const mediaExists = await mediaRepository.exists({ where: { id: dto.mediaId } });
  if (!mediaExists) {
    errors.push(`Media with id ${dto.mediaId} does not exist`);
  }

  // Validate tag definitions exist
  const { valid: validTagDefinitionIds, invalid: invalidTagDefinitionIds } =
    await validateTagDefinitionsExist(dto.tagDefinitionIds);

  if (invalidTagDefinitionIds.length > 0) {
    errors.push(`Invalid TagDefinition IDs: ${invalidTagDefinitionIds.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    validTagDefinitionIds,
  };
};

/**
 * Periodic cleanup job to maintain data integrity
 */
export const performPeriodicCleanup = async (): Promise<{
  orphanedMediaTagsRemoved: number;
  timestamp: Date;
}> => {
  console.log("🔄 Starting periodic tag drift cleanup...");

  const { removedCount } = await cleanupOrphanedMediaTags();
  const timestamp = new Date();

  console.log(`✅ Periodic cleanup completed at ${timestamp.toISOString()}`);
  console.log(`   - Removed ${removedCount} orphaned MediaTag entries`);

  return {
    orphanedMediaTagsRemoved: removedCount,
    timestamp,
  };
};

/**
 * Get drift prevention statistics
 */
export const getDriftPreventionStats = async (): Promise<{
  totalMediaTags: number;
  orphanedMediaTags: number;
  totalTagDefinitions: number;
  integrityPercentage: number;
}> => {
  const dataSource = await db();
  const mediaTagRepository = dataSource.getRepository(MediaTag);
  const tagDefinitionRepository = dataSource.getRepository(TagDefinition);

  const [totalMediaTags, orphanedTags, totalTagDefinitions] = await Promise.all([
    mediaTagRepository.count(),
    findOrphanedMediaTags(),
    tagDefinitionRepository.count(),
  ]);

  const orphanedCount = orphanedTags.length;
  const integrityPercentage =
    totalMediaTags > 0 ? ((totalMediaTags - orphanedCount) / totalMediaTags) * 100 : 100;

  return {
    totalMediaTags,
    orphanedMediaTags: orphanedCount,
    totalTagDefinitions,
    integrityPercentage: Math.round(integrityPercentage * 100) / 100,
  };
};

/**
 * Cleanup scheduler for periodic maintenance
 */
let cleanupInterval: NodeJS.Timeout | null = null;

/**
 * Start periodic cleanup with configurable interval
 */
export const startPeriodicCleanup = (intervalMinutes: number = 60): void => {
  if (cleanupInterval) {
    console.log("⚠️ Periodic cleanup is already running");
    return;
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`🔄 Starting periodic tag drift cleanup (every ${intervalMinutes} minutes)`);

  cleanupInterval = setInterval(async () => {
    try {
      await performPeriodicCleanup();
    } catch (error) {
      console.error("❌ Periodic cleanup failed:", error);
    }
  }, intervalMs);
};

/**
 * Stop periodic cleanup
 */
export const stopPeriodicCleanup = (): void => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log("⏹️ Periodic tag drift cleanup stopped");
  }
};

/**
 * Check if periodic cleanup is running
 */
export const isPeriodicCleanupRunning = (): boolean => {
  return cleanupInterval !== null;
};
