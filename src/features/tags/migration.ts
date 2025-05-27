import { In } from "typeorm";
import { db } from "../../lib/db";
import { MediaTag, TagDefinition, TagDimension } from "./entity";

// Import dimension constants - these need to be duplicated here since we can't import from renderer in main process
const TIER_DIMENSION_NAME = "Tier" as const;
const CATEGORY_DIMENSION_NAME = "Category" as const;

const TIER_VALUES = {
  FREE: "Free",
  PAID: "Paid",
  PREMIUM: "Premium",
} as const;

const TIER_VALUE_TO_LEVEL = {
  [TIER_VALUES.FREE]: 0,
  [TIER_VALUES.PAID]: 1,
  [TIER_VALUES.PREMIUM]: 2,
} as const;

const getTierLevelFromValue = (value: string): number | null => {
  const tierValue = value as keyof typeof TIER_VALUE_TO_LEVEL;
  return TIER_VALUE_TO_LEVEL[tierValue] ?? null;
};

type MigrationResult = {
  categoriesUpdated: number;
  tiersUpdated: number;
  mediaTagsUpdated: number;
  errors: string[];
};

type RollbackData = {
  tagDefinitionUpdates: Array<{
    id: number;
    originalStickerDisplay: string;
    originalShortRepresentation: string | null;
  }>;
  mediaTagUpdates: Array<{
    id: number;
    originalStickerDisplay: string;
    originalShortRepresentation: string | null;
  }>;
};

/**
 * Migration script to set appropriate sticker display properties for existing tags
 *
 * Categories: stickerDisplay = 'color' (use existing color bubbles)
 * Tiers: stickerDisplay = 'short' with shortRepresentation = '$'.repeat(level + 1)
 */
export const migrateStickerDisplayProperties = async (): Promise<MigrationResult> => {
  const dataSource = await db();
  const result: MigrationResult = {
    categoriesUpdated: 0,
    tiersUpdated: 0,
    mediaTagsUpdated: 0,
    errors: [],
  };

  try {
    console.log("🔄 Starting sticker display properties migration...");

    await dataSource.transaction(async (manager) => {
      const tagDefinitionRepository = manager.getRepository(TagDefinition);
      const mediaTagRepository = manager.getRepository(MediaTag);
      const dimensionRepository = manager.getRepository(TagDimension);

      // Get Category and Tier dimensions
      const categoryDimension = await dimensionRepository.findOne({
        where: { name: CATEGORY_DIMENSION_NAME },
      });
      const tierDimension = await dimensionRepository.findOne({
        where: { name: TIER_DIMENSION_NAME },
      });

      if (!categoryDimension && !tierDimension) {
        console.log("⚠️ No Category or Tier dimensions found, skipping migration");
        return;
      }

      // Migrate Category tags to use color display
      if (categoryDimension) {
        const categoryTags = await tagDefinitionRepository.find({
          where: { dimensionId: categoryDimension.id },
          relations: ["dimension"],
        });

        for (const tag of categoryTags) {
          // Only update if not already configured
          if (tag.stickerDisplay === "none") {
            await tagDefinitionRepository.update(tag.id, {
              stickerDisplay: "color",
            });

            // Update corresponding MediaTags
            const mediaTags = await mediaTagRepository.find({
              where: { tagDefinitionId: tag.id },
            });

            for (const mediaTag of mediaTags) {
              mediaTag.stickerDisplay = "color";
            }

            if (mediaTags.length > 0) {
              await mediaTagRepository.save(mediaTags);
              result.mediaTagsUpdated += mediaTags.length;
            }

            result.categoriesUpdated++;
            console.log(`✅ Updated category tag: ${tag.displayName} to use color display`);
          }
        }
      }

      // Migrate Tier tags to use short display with dollar signs
      if (tierDimension) {
        const tierTags = await tagDefinitionRepository.find({
          where: { dimensionId: tierDimension.id },
          relations: ["dimension"],
        });

        for (const tag of tierTags) {
          // Only update if not already configured
          if (tag.stickerDisplay === "none") {
            // Determine tier level from tag value
            const tierLevel = getTierLevelFromValue(tag.value);
            const shortRepresentation = tierLevel !== null ? "$".repeat(tierLevel + 1) : "$";

            await tagDefinitionRepository.update(tag.id, {
              stickerDisplay: "short",
              shortRepresentation,
            });

            // Update corresponding MediaTags
            const mediaTags = await mediaTagRepository.find({
              where: { tagDefinitionId: tag.id },
            });

            for (const mediaTag of mediaTags) {
              mediaTag.stickerDisplay = "short";
              mediaTag.shortRepresentation = shortRepresentation;
            }

            if (mediaTags.length > 0) {
              await mediaTagRepository.save(mediaTags);
              result.mediaTagsUpdated += mediaTags.length;
            }

            result.tiersUpdated++;
            console.log(
              `✅ Updated tier tag: ${tag.displayName} to use short display (${shortRepresentation})`
            );
          }
        }
      }
    });

    console.log("✅ Sticker display properties migration completed successfully");
    console.log(`📊 Migration summary:
      - Categories updated: ${result.categoriesUpdated}
      - Tiers updated: ${result.tiersUpdated}
      - MediaTag records updated: ${result.mediaTagsUpdated}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(errorMessage);
    console.error("❌ Error during sticker display properties migration:", error);
    throw error;
  }

  return result;
};

/**
 * Capture current state before migration for rollback purposes
 */
export const captureRollbackData = async (): Promise<RollbackData> => {
  const dataSource = await db();
  const rollbackData: RollbackData = {
    tagDefinitionUpdates: [],
    mediaTagUpdates: [],
  };

  try {
    const tagDefinitionRepository = dataSource.getRepository(TagDefinition);
    const mediaTagRepository = dataSource.getRepository(MediaTag);
    const dimensionRepository = dataSource.getRepository(TagDimension);

    // Get Category and Tier dimensions
    const categoryDimension = await dimensionRepository.findOne({
      where: { name: CATEGORY_DIMENSION_NAME },
    });
    const tierDimension = await dimensionRepository.findOne({
      where: { name: TIER_DIMENSION_NAME },
    });

    const dimensionIds = [categoryDimension?.id, tierDimension?.id].filter(Boolean) as number[];

    if (dimensionIds.length > 0) {
      // Capture TagDefinition state
      const tagDefinitions = await tagDefinitionRepository.find({
        where: { dimensionId: In(dimensionIds) },
      });

      for (const tag of tagDefinitions) {
        rollbackData.tagDefinitionUpdates.push({
          id: tag.id,
          originalStickerDisplay: tag.stickerDisplay,
          originalShortRepresentation: tag.shortRepresentation,
        });
      }

      // Capture MediaTag state
      const tagIds = tagDefinitions.map((tag) => tag.id);
      const mediaTags = await mediaTagRepository.find({
        where: { tagDefinitionId: In(tagIds) },
      });

      for (const mediaTag of mediaTags) {
        rollbackData.mediaTagUpdates.push({
          id: mediaTag.id,
          originalStickerDisplay: mediaTag.stickerDisplay,
          originalShortRepresentation: mediaTag.shortRepresentation,
        });
      }
    }

    console.log(
      `📋 Captured rollback data for ${rollbackData.tagDefinitionUpdates.length} TagDefinitions and ${rollbackData.mediaTagUpdates.length} MediaTags`
    );
  } catch (error) {
    console.error("❌ Error capturing rollback data:", error);
    throw error;
  }

  return rollbackData;
};

/**
 * Rollback migration changes using captured data
 */
export const rollbackStickerDisplayMigration = async (
  rollbackData: RollbackData
): Promise<void> => {
  const dataSource = await db();

  try {
    console.log("🔄 Starting rollback of sticker display properties migration...");

    await dataSource.transaction(async (manager) => {
      const tagDefinitionRepository = manager.getRepository(TagDefinition);
      const mediaTagRepository = manager.getRepository(MediaTag);

      // Rollback TagDefinition changes
      for (const update of rollbackData.tagDefinitionUpdates) {
        await tagDefinitionRepository.update(update.id, {
          stickerDisplay: update.originalStickerDisplay as "none" | "color" | "short",
          shortRepresentation: update.originalShortRepresentation,
        });
      }

      // Rollback MediaTag changes
      for (const update of rollbackData.mediaTagUpdates) {
        await mediaTagRepository.update(update.id, {
          stickerDisplay: update.originalStickerDisplay as "none" | "color" | "short",
          shortRepresentation: update.originalShortRepresentation,
        });
      }
    });

    console.log("✅ Rollback completed successfully");
    console.log(`📊 Rollback summary:
      - TagDefinitions restored: ${rollbackData.tagDefinitionUpdates.length}
      - MediaTags restored: ${rollbackData.mediaTagUpdates.length}`);
  } catch (error) {
    console.error("❌ Error during rollback:", error);
    throw error;
  }
};

/**
 * Validate migration results by checking consistency between TagDefinition and MediaTag
 */
export const validateMigrationResults = async (): Promise<{
  isValid: boolean;
  errors: string[];
}> => {
  const dataSource = await db();
  const errors: string[] = [];

  try {
    const tagDefinitionRepository = dataSource.getRepository(TagDefinition);
    const mediaTagRepository = dataSource.getRepository(MediaTag);
    const dimensionRepository = dataSource.getRepository(TagDimension);

    // Get Category and Tier dimensions
    const categoryDimension = await dimensionRepository.findOne({
      where: { name: CATEGORY_DIMENSION_NAME },
    });
    const tierDimension = await dimensionRepository.findOne({
      where: { name: TIER_DIMENSION_NAME },
    });

    const dimensionIds = [categoryDimension?.id, tierDimension?.id].filter(Boolean) as number[];

    if (dimensionIds.length > 0) {
      const tagDefinitions = await tagDefinitionRepository.find({
        where: { dimensionId: In(dimensionIds) },
        relations: ["dimension"],
      });

      for (const tag of tagDefinitions) {
        // Check MediaTag consistency
        const mediaTags = await mediaTagRepository.find({
          where: { tagDefinitionId: tag.id },
        });

        for (const mediaTag of mediaTags) {
          if (mediaTag.stickerDisplay !== tag.stickerDisplay) {
            errors.push(
              `MediaTag ${mediaTag.id} stickerDisplay (${mediaTag.stickerDisplay}) doesn't match TagDefinition ${tag.id} (${tag.stickerDisplay})`
            );
          }

          if (mediaTag.shortRepresentation !== tag.shortRepresentation) {
            errors.push(
              `MediaTag ${mediaTag.id} shortRepresentation (${mediaTag.shortRepresentation}) doesn't match TagDefinition ${tag.id} (${tag.shortRepresentation})`
            );
          }
        }

        // Validate expected values
        if (tag.dimension.name === CATEGORY_DIMENSION_NAME && tag.stickerDisplay !== "color") {
          errors.push(
            `Category tag ${tag.id} should have stickerDisplay = 'color', but has '${tag.stickerDisplay}'`
          );
        }

        if (tag.dimension.name === TIER_DIMENSION_NAME && tag.stickerDisplay !== "short") {
          errors.push(
            `Tier tag ${tag.id} should have stickerDisplay = 'short', but has '${tag.stickerDisplay}'`
          );
        }

        if (
          tag.dimension.name === TIER_DIMENSION_NAME &&
          tag.stickerDisplay === "short" &&
          !tag.shortRepresentation?.startsWith("$")
        ) {
          errors.push(
            `Tier tag ${tag.id} should have shortRepresentation starting with '$', but has '${tag.shortRepresentation}'`
          );
        }
      }
    }

    const isValid = errors.length === 0;

    if (isValid) {
      console.log("✅ Migration validation passed - all data is consistent");
    } else {
      console.log(`❌ Migration validation failed with ${errors.length} errors`);
      errors.forEach((error) => console.log(`  - ${error}`));
    }

    return { isValid, errors };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(`Validation error: ${errorMessage}`);
    console.error("❌ Error during migration validation:", error);
    return { isValid: false, errors };
  }
};

/**
 * Complete migration workflow with safety checks
 */
export const runStickerDisplayMigration = async (): Promise<MigrationResult> => {
  console.log("🚀 Starting complete sticker display migration workflow...");

  // Step 1: Capture rollback data
  const rollbackData = await captureRollbackData();

  try {
    // Step 2: Run migration
    const result = await migrateStickerDisplayProperties();

    // Step 3: Validate results
    const validation = await validateMigrationResults();

    if (!validation.isValid) {
      console.log("⚠️ Migration validation failed, rolling back changes...");
      await rollbackStickerDisplayMigration(rollbackData);
      throw new Error(`Migration validation failed: ${validation.errors.join(", ")}`);
    }

    console.log("🎉 Migration completed successfully with validation passed!");
    return result;
  } catch (error) {
    console.log("❌ Migration failed, attempting rollback...");
    try {
      await rollbackStickerDisplayMigration(rollbackData);
      console.log("✅ Rollback completed successfully");
    } catch (rollbackError) {
      console.error("💥 Rollback also failed:", rollbackError);
      throw new Error(
        `Migration failed and rollback also failed: ${error}. Rollback error: ${rollbackError}`
      );
    }
    throw error;
  }
};
