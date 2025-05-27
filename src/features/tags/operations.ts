import { In } from "typeorm";
import { normalizeHexColor, validateHexColor } from "../../lib/color";
import { db } from "../../lib/db";
import { CATEGORY_COLORS } from "../categories/colors";
import {
  AssignTagsDto,
  CreateTagDefinitionDto,
  CreateTagDimensionDto,
  UpdateTagDefinitionDto,
  UpdateTagDimensionDto,
} from "./api-type";
import { validateMediaTagAssignment } from "./drift-prevention";
import { MediaTag, STICKER_DISPLAY_MODES, TagDefinition, TagDimension } from "./entity";

// Dimension Operations
export const createTagDimension = async (dto: CreateTagDimensionDto): Promise<TagDimension> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDimension);

  const dimension = repository.create({
    ...dto,
    sortOrder: dto.sortOrder ?? 0,
  });

  return repository.save(dimension);
};

export const updateTagDimension = async (
  id: number,
  dto: UpdateTagDimensionDto
): Promise<TagDimension> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDimension);

  await repository.update(id, dto);
  const dimension = await repository.findOne({ where: { id } });

  if (!dimension) {
    throw new Error(`TagDimension with id ${id} not found`);
  }

  return dimension;
};

export const deleteTagDimension = async (id: number): Promise<void> => {
  const dataSource = await db();

  // Use a transaction to ensure all operations succeed or fail together
  await dataSource.transaction(async (manager) => {
    // First, get all tag definitions for this dimension
    const tagDefinitions = await manager
      .getRepository(TagDefinition)
      .find({ where: { dimensionId: id } });

    if (tagDefinitions.length > 0) {
      const tagIds = tagDefinitions.map((tag) => tag.id);

      // Delete all media tags associated with these tag definitions
      await manager.getRepository(MediaTag).delete({ tagDefinitionId: In(tagIds) });

      // Delete all tag definitions for this dimension
      await manager.getRepository(TagDefinition).delete({ dimensionId: id });
    }

    // Finally, delete the dimension itself
    await manager.getRepository(TagDimension).delete(id);
  });
};

export const getAllTagDimensions = async (): Promise<TagDimension[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDimension);

  return repository.find({
    order: { sortOrder: "ASC", name: "ASC" },
    relations: ["tags"],
  });
};

export const getTagDimensionById = async (id: number): Promise<TagDimension> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDimension);

  const dimension = await repository.findOne({
    where: { id },
    relations: ["tags"],
  });

  if (!dimension) {
    throw new Error(`TagDimension with id ${id} not found`);
  }

  return dimension;
};

// Helper function to assign color automatically for categorical tags
const assignColorForCategoricalTag = async (
  dimensionId: number,
  providedColor?: string
): Promise<string | undefined> => {
  const dataSource = await db();
  const dimensionRepository = dataSource.getRepository(TagDimension);
  const tagRepository = dataSource.getRepository(TagDefinition);

  // Get the dimension to check if it's categorical
  const dimension = await dimensionRepository.findOne({ where: { id: dimensionId } });

  if (!dimension || dimension.dataType !== "categorical") {
    return undefined; // Only categorical tags get colors
  }

  // If color is explicitly provided, use it
  if (providedColor) {
    return providedColor;
  }

  // Get existing colors used in this dimension to avoid duplicates
  const existingTags = await tagRepository.find({
    where: { dimensionId },
    select: ["color"],
  });

  const usedColors = new Set(
    existingTags.map((tag) => tag.color).filter((color) => color !== null && color !== undefined)
  );

  // Find the first available color from the palette
  for (const color of CATEGORY_COLORS) {
    if (!usedColors.has(color)) {
      return color;
    }
  }

  // If all colors are used, cycle back to the beginning
  return CATEGORY_COLORS[existingTags.length % CATEGORY_COLORS.length];
};

// Tag Definition Operations
export const createTagDefinition = async (dto: CreateTagDefinitionDto): Promise<TagDefinition> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);
  const dimensionRepository = dataSource.getRepository(TagDimension);

  const dimension = await dimensionRepository.findOne({ where: { id: dto.dimensionId } });

  // Validate color format if provided
  if (dto.color) {
    const colorError = validateHexColor(dto.color);
    if (colorError) {
      throw new Error(`Invalid color format: ${colorError}`);
    }
    dto.color = normalizeHexColor(dto.color);
  }

  // Validate stickerDisplay enum value if provided
  if (dto.stickerDisplay && !STICKER_DISPLAY_MODES.includes(dto.stickerDisplay)) {
    throw new Error(
      `Invalid stickerDisplay value: ${dto.stickerDisplay}. Must be 'none', 'color', or 'short'.`
    );
  }

  // Assign color automatically for categorical tags
  const assignedColor = await assignColorForCategoricalTag(dto.dimensionId, dto.color);

  const tag = repository.create({
    ...dto,
    color: assignedColor,
    sortOrder: dto.sortOrder ?? 0,
  });
  tag.dimension = dimension;

  const saved = await repository.save(tag);

  return saved;
};

export const updateTagDefinition = async (
  id: number,
  dto: UpdateTagDefinitionDto
): Promise<TagDefinition> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);

  // Validate color format if provided
  if (dto.color) {
    const { validateHexColor, normalizeHexColor } = await import("../../lib/color");
    const colorError = validateHexColor(dto.color);
    if (colorError) {
      throw new Error(`Invalid color format: ${colorError}`);
    }
    dto.color = normalizeHexColor(dto.color);
  }

  // Validate stickerDisplay enum value if provided
  if (dto.stickerDisplay && !STICKER_DISPLAY_MODES.includes(dto.stickerDisplay)) {
    throw new Error(
      `Invalid stickerDisplay value: ${dto.stickerDisplay}. Must be 'none', 'color', or 'short'.`
    );
  }

  await repository.update(id, dto);
  const tag = await repository.findOne({
    where: { id },
    relations: ["dimension", "parent", "children"],
  });

  if (!tag) {
    throw new Error(`TagDefinition with id ${id} not found`);
  }

  // Sync denormalized fields in MediaTag when TagDefinition is updated
  await syncDenormalizedFieldsForTag(id);

  return tag;
};

// Validation hook to sync denormalized fields when TagDefinition changes
const syncDenormalizedFieldsForTag = async (tagDefinitionId: number): Promise<void> => {
  const dataSource = await db();
  const mediaTagRepository = dataSource.getRepository(MediaTag);
  const tagDefinitionRepository = dataSource.getRepository(TagDefinition);

  // Get the updated tag definition with its dimension
  const tagDefinition = await tagDefinitionRepository.findOne({
    where: { id: tagDefinitionId },
    relations: ["dimension"],
  });

  if (!tagDefinition) {
    return;
  }

  // Get all MediaTags that reference this TagDefinition
  const mediaTags = await mediaTagRepository.find({
    where: { tagDefinitionId },
  });

  // Update denormalized fields for each MediaTag
  for (const mediaTag of mediaTags) {
    populateDenormalizedFields(mediaTag, tagDefinition);
  }

  // Save all updated MediaTags
  if (mediaTags.length > 0) {
    await mediaTagRepository.save(mediaTags);
  }
};

export const deleteTagDefinition = async (id: number): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);
  const mediaTagRepository = dataSource.getRepository(MediaTag);

  // Clean up associated MediaTags before deleting the TagDefinition
  // This prevents orphaned MediaTags from being created
  const associatedMediaTags = await mediaTagRepository.find({
    where: { tagDefinitionId: id },
  });

  if (associatedMediaTags.length > 0) {
    await mediaTagRepository.remove(associatedMediaTags);
    console.log(
      `🧹 Removed ${associatedMediaTags.length} MediaTag entries associated with TagDefinition ${id}`
    );
  }

  await repository.delete(id);
};

export const getTagsByDimension = async (dimensionId: number): Promise<TagDefinition[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);

  return repository.find({
    where: { dimensionId },
    relations: ["parent", "children"],
    order: { sortOrder: "ASC", displayName: "ASC" },
  });
};

export const getTagDefinitionById = async (id: number): Promise<TagDefinition> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);

  const tag = await repository.findOne({
    where: { id },
    relations: ["dimension", "parent", "children"],
  });

  if (!tag) {
    throw new Error(`TagDefinition with id ${id} not found`);
  }

  return tag;
};

// Helper function to populate denormalized fields in MediaTag
const populateDenormalizedFields = (
  mediaTag: Partial<MediaTag>,
  tagDefinition: TagDefinition
): void => {
  // Populate denormalized fields for performance optimization
  mediaTag.dimensionId = tagDefinition.dimensionId;
  mediaTag.dimensionName = tagDefinition.dimension.name;
  mediaTag.dataType = tagDefinition.dimension.dataType;
  mediaTag.tagValue = tagDefinition.value;
  mediaTag.tagDisplayName = tagDefinition.displayName;

  // Use the color field directly from TagDefinition
  mediaTag.color = tagDefinition.color || null;

  // Use the sticker display properties directly from TagDefinition
  mediaTag.stickerDisplay = tagDefinition.stickerDisplay || "none";
  mediaTag.shortRepresentation = tagDefinition.shortRepresentation || null;

  // Parse and store typed values for performance optimization
  if (tagDefinition.dimension.dataType === "numerical") {
    const numericValue = parseFloat(tagDefinition.value);
    mediaTag.numericValue = isNaN(numericValue) ? null : numericValue;
  } else if (tagDefinition.dimension.dataType === "boolean") {
    mediaTag.booleanValue = tagDefinition.value.toLowerCase() === "true";
  }
};

// Media Tagging Operations
export const assignTagsToMedia = async (dto: AssignTagsDto): Promise<MediaTag[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(MediaTag);
  const { Media } = await import("../library/entity");

  // Validate assignment before proceeding (drift prevention)
  const { validateMediaTagAssignment } = await import("./drift-prevention");
  const validation = await validateMediaTagAssignment({
    mediaId: dto.mediaId,
    tagDefinitionIds: dto.tagDefinitionIds,
  });

  if (!validation.isValid) {
    throw new Error(`Tag assignment validation failed: ${validation.errors.join(", ")}`);
  }

  // Use only valid tag definition IDs
  const validTagDefinitionIds = validation.validTagDefinitionIds;

  if (validTagDefinitionIds.length === 0) {
    console.warn(`No valid tag definitions found for assignment to media ${dto.mediaId}`);
    return [];
  }

  // Remove existing tags for this media and dimension(s) to avoid duplicates
  const tagDefinitions = await dataSource
    .getRepository(TagDefinition)
    .findBy({ id: In(validTagDefinitionIds) });
  const dimensionIds = [...new Set(tagDefinitions.map((td) => td.dimensionId))];

  await repository
    .createQueryBuilder()
    .delete()
    .where("mediaId = :mediaId", { mediaId: dto.mediaId })
    .andWhere(
      "tagDefinitionId IN (SELECT id FROM tag_definition WHERE dimensionId IN (:...dimensionIds))",
      { dimensionIds }
    )
    .execute();

  // Load the media entity and tag definitions with their relations
  const media = await dataSource.getRepository(Media).findOne({ where: { id: dto.mediaId } });
  const tagDefinitionsWithRelations = await dataSource.getRepository(TagDefinition).find({
    where: { id: In(validTagDefinitionIds) },
    relations: ["dimension"],
  });

  if (!media) {
    throw new Error(`Media with id ${dto.mediaId} not found`);
  }

  // Create new tag assignments with proper entity relations and denormalized fields
  const mediaTags = tagDefinitionsWithRelations.map((tagDefinition) => {
    const mediaTagData = {
      mediaId: dto.mediaId,
      media: media,
      tagDefinitionId: tagDefinition.id,
      tag: tagDefinition,
      source: dto.source,
      confidence: dto.confidence,
    };

    // Populate denormalized fields for performance optimization
    populateDenormalizedFields(mediaTagData, tagDefinition);

    return repository.create(mediaTagData);
  });

  return repository.save(mediaTags);
};

export const removeTagsFromMedia = async (mediaId: string, tagIds: number[]): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(MediaTag);

  await repository.delete({
    mediaId,
    tagDefinitionId: In(tagIds),
  });
};

export const getMediaTags = async (mediaId: string, dimensionId?: number): Promise<MediaTag[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(MediaTag);

  const queryBuilder = repository
    .createQueryBuilder("mt")
    .leftJoinAndSelect("mt.media", "media")
    .leftJoinAndSelect("mt.tag", "tag")
    .leftJoinAndSelect("tag.dimension", "dimension")
    .where("mt.mediaId = :mediaId", { mediaId });

  if (dimensionId) {
    queryBuilder.andWhere("tag.dimensionId = :dimensionId", { dimensionId });
  }

  return queryBuilder.getMany();
};

export const bulkAssignTags = async (assignments: AssignTagsDto[]): Promise<MediaTag[]> => {
  const validationResults = await Promise.all(
    assignments.map(async (assignment) => ({
      assignment,
      validation: await validateMediaTagAssignment({
        mediaId: assignment.mediaId,
        tagDefinitionIds: assignment.tagDefinitionIds,
      }),
    }))
  );

  // Check for any validation failures
  const invalidAssignments = validationResults.filter((result) => !result.validation.isValid);
  if (invalidAssignments.length > 0) {
    const errors = invalidAssignments.map(
      (result) => `Media ${result.assignment.mediaId}: ${result.validation.errors.join(", ")}`
    );
    throw new Error(`Bulk assignment validation failed:\n${errors.join("\n")}`);
  }

  // Process all assignments (validation is already done in assignTagsToMedia)
  const results = await Promise.all(assignments.map((assignment) => assignTagsToMedia(assignment)));

  return results.flat();
};
