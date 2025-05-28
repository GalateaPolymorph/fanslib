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
  stickerDisplayPropertiesSynced: number;
  timestamp: Date;
}> => {
  console.log("🔄 Starting periodic tag drift cleanup...");

  const [{ removedCount }, { updatedCount }] = await Promise.all([
    cleanupOrphanedMediaTags(),
    syncStickerDisplayProperties(),
  ]);

  const timestamp = new Date();

  console.log(`✅ Periodic cleanup completed at ${timestamp.toISOString()}`);
  console.log(`   - Removed ${removedCount} orphaned MediaTag entries`);
  console.log(`   - Synchronized ${updatedCount} sticker display properties`);

  return {
    orphanedMediaTagsRemoved: removedCount,
    stickerDisplayPropertiesSynced: updatedCount,
    timestamp,
  };
};

/**
 * Get drift prevention statistics
 */
export const getDriftPreventionStats = async (): Promise<{
  totalMediaTags: number;
  orphanedMediaTags: number;
  inconsistentStickerDisplayProperties: number;
  totalTagDefinitions: number;
  integrityPercentage: number;
}> => {
  const dataSource = await db();
  const mediaTagRepository = dataSource.getRepository(MediaTag);
  const tagDefinitionRepository = dataSource.getRepository(TagDefinition);

  const [totalMediaTags, orphanedTags, outdatedStickerTags, totalTagDefinitions] =
    await Promise.all([
      mediaTagRepository.count(),
      findOrphanedMediaTags(),
      findOutdatedStickerDisplayProperties(),
      tagDefinitionRepository.count(),
    ]);

  const orphanedCount = orphanedTags.length;
  const inconsistentStickerCount = outdatedStickerTags.length;
  const totalInconsistencies = orphanedCount + inconsistentStickerCount;

  const integrityPercentage =
    totalMediaTags > 0 ? ((totalMediaTags - totalInconsistencies) / totalMediaTags) * 100 : 100;

  return {
    totalMediaTags,
    orphanedMediaTags: orphanedCount,
    inconsistentStickerDisplayProperties: inconsistentStickerCount,
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

/**
 * Find MediaTags with outdated sticker display properties
 */
export const findOutdatedStickerDisplayProperties = async (): Promise<MediaTag[]> => {
  const dataSource = await db();
  const mediaTagRepository = dataSource.getRepository(MediaTag);

  // Use query builder to find MediaTags where denormalized fields don't match their sources
  // stickerDisplay should match TagDimension, shortRepresentation should match TagDefinition
  const outdatedMediaTags = await mediaTagRepository
    .createQueryBuilder("mt")
    .leftJoin("mt.tag", "td")
    .leftJoin("td.dimension", "dim")
    .where(
      "(mt.stickerDisplay != dim.stickerDisplay OR " +
        "(mt.stickerDisplay IS NULL AND dim.stickerDisplay IS NOT NULL) OR " +
        "(mt.stickerDisplay IS NOT NULL AND dim.stickerDisplay IS NULL)) OR " +
        "(mt.shortRepresentation != td.shortRepresentation OR " +
        "(mt.shortRepresentation IS NULL AND td.shortRepresentation IS NOT NULL) OR " +
        "(mt.shortRepresentation IS NOT NULL AND td.shortRepresentation IS NULL))"
    )
    .getMany();

  return outdatedMediaTags;
};

/**
 * Synchronize sticker display properties from their correct sources to MediaTag
 */
export const syncStickerDisplayProperties = async (): Promise<{
  updatedCount: number;
  updatedIds: number[];
}> => {
  const outdatedTags = await findOutdatedStickerDisplayProperties();

  if (outdatedTags.length === 0) {
    return { updatedCount: 0, updatedIds: [] };
  }

  const dataSource = await db();
  const mediaTagRepository = dataSource.getRepository(MediaTag);
  const tagDefinitionRepository = dataSource.getRepository(TagDefinition);

  const updatedIds: number[] = [];

  // Process in batches to avoid memory issues with large datasets
  const batchSize = 100;
  for (let i = 0; i < outdatedTags.length; i += batchSize) {
    const batch = outdatedTags.slice(i, i + batchSize);
    const tagDefinitionIds = batch.map((mt) => mt.tagDefinitionId);

    // Get the corresponding TagDefinitions with their dimensions
    const tagDefinitions = await tagDefinitionRepository.find({
      where: { id: In(tagDefinitionIds) },
      relations: ["dimension"],
    });

    // Create a map for quick lookup
    const tagDefinitionMap = new Map(tagDefinitions.map((td) => [td.id, td]));

    // Update each MediaTag with correct denormalized fields from their sources
    for (const mediaTag of batch) {
      const tagDefinition = tagDefinitionMap.get(mediaTag.tagDefinitionId);
      if (tagDefinition) {
        // Update denormalized fields: stickerDisplay from dimension, shortRepresentation from tag
        mediaTag.stickerDisplay = tagDefinition.dimension.stickerDisplay || "none";
        mediaTag.shortRepresentation = tagDefinition.shortRepresentation || null;
        updatedIds.push(mediaTag.id);
      }
    }

    // Save the batch
    await mediaTagRepository.save(batch);
  }

  console.log(`🔄 Synchronized ${outdatedTags.length} MediaTag sticker display properties`);

  return { updatedCount: outdatedTags.length, updatedIds };
};

/**
 * Validate consistency of sticker display properties between their sources and MediaTag
 * stickerDisplay should match TagDimension, shortRepresentation should match TagDefinition
 */
export const validateStickerDisplayConsistency = async (): Promise<{
  isConsistent: boolean;
  inconsistentCount: number;
  totalChecked: number;
}> => {
  const outdatedTags = await findOutdatedStickerDisplayProperties();
  const dataSource = await db();
  const mediaTagRepository = dataSource.getRepository(MediaTag);

  const totalMediaTags = await mediaTagRepository.count();
  const inconsistentCount = outdatedTags.length;

  return {
    isConsistent: inconsistentCount === 0,
    inconsistentCount,
    totalChecked: totalMediaTags,
  };
};
