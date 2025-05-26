import { In } from "typeorm";
import { db } from "../../lib/db";
import {
  AssignTagsDto,
  CreateTagDefinitionDto,
  CreateTagDimensionDto,
  UpdateTagDefinitionDto,
  UpdateTagDimensionDto,
} from "./api-type";
import { MediaTag, TagDefinition, TagDimension } from "./entity";

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

// Tag Definition Operations
export const createTagDefinition = async (dto: CreateTagDefinitionDto): Promise<TagDefinition> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);
  const dimensionRepository = dataSource.getRepository(TagDimension);

  const dimension = await dimensionRepository.findOne({ where: { id: dto.dimensionId } });
  const tag = repository.create(dto);
  tag.dimension = dimension;

  const saved = await repository.save(tag);
  console.log(saved);

  return saved;
};

export const updateTagDefinition = async (
  id: number,
  dto: UpdateTagDefinitionDto
): Promise<TagDefinition> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);

  await repository.update(id, dto);
  const tag = await repository.findOne({
    where: { id },
    relations: ["dimension", "parent", "children"],
  });

  if (!tag) {
    throw new Error(`TagDefinition with id ${id} not found`);
  }

  return tag;
};

export const deleteTagDefinition = async (id: number): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);

  await repository.delete(id);
};

export const getTagsByDimension = async (dimensionId: number): Promise<TagDefinition[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(TagDefinition);

  return repository.find({
    where: { dimensionId },
    relations: ["parent", "children"],
    order: { displayName: "ASC" },
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

// Media Tagging Operations
export const assignTagsToMedia = async (dto: AssignTagsDto): Promise<MediaTag[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(MediaTag);
  const { Media } = await import("../library/entity");

  // Remove existing tags for this media and dimension(s) to avoid duplicates
  const tagDefinitions = await dataSource
    .getRepository(TagDefinition)
    .findBy({ id: In(dto.tagDefinitionIds) });
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
    where: { id: In(dto.tagDefinitionIds) },
    relations: ["dimension"],
  });

  if (!media) {
    throw new Error(`Media with id ${dto.mediaId} not found`);
  }

  // Create new tag assignments with proper entity relations
  const mediaTags = tagDefinitionsWithRelations.map((tagDefinition) =>
    repository.create({
      mediaId: dto.mediaId,
      media: media,
      tagDefinitionId: tagDefinition.id,
      tag: tagDefinition,
      source: dto.source,
      confidence: dto.confidence,
    })
  );

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
  const results = await Promise.all(assignments.map((assignment) => assignTagsToMedia(assignment)));

  return results.flat();
};

export const getRecommendedTags = async (mediaId: string): Promise<TagDefinition[]> => {
  const dataSource = await db();
  const mediaTagRepository = dataSource.getRepository(MediaTag);

  // Get existing tags for this media
  const existingTags = await getMediaTags(mediaId);
  const existingTagIds = existingTags.map((mt) => mt.tagDefinitionId);

  // Strategy 1: Find tags that frequently co-occur with existing tags
  const coOccurringTags =
    existingTagIds.length > 0
      ? await mediaTagRepository
          .createQueryBuilder("mt1")
          .innerJoin(
            MediaTag,
            "mt2",
            "mt1.mediaId = mt2.mediaId AND mt1.tagDefinitionId != mt2.tagDefinitionId"
          )
          .leftJoinAndSelect("mt2.tag", "tag")
          .leftJoinAndSelect("tag.dimension", "dimension")
          .where("mt1.tagDefinitionId IN (:...existingTagIds)", { existingTagIds })
          .andWhere("mt2.tagDefinitionId NOT IN (:...existingTagIds)", { existingTagIds })
          .groupBy("mt2.tagDefinitionId")
          .orderBy("COUNT(*)", "DESC")
          .limit(5)
          .getMany()
      : [];

  // Strategy 2: Find popular tags within the same dimensions as existing tags
  const dimensionIds = [
    ...new Set(existingTags.filter((mt) => mt.tag?.dimensionId).map((mt) => mt.tag!.dimensionId)),
  ];
  const popularTagsInDimensions =
    dimensionIds.length > 0
      ? await mediaTagRepository
          .createQueryBuilder("mt")
          .leftJoinAndSelect("mt.tag", "tag")
          .leftJoinAndSelect("tag.dimension", "dimension")
          .where("tag.dimensionId IN (:...dimensionIds)", { dimensionIds })
          .andWhere("mt.tagDefinitionId NOT IN (:...existingTagIds)", {
            existingTagIds: existingTagIds.length > 0 ? existingTagIds : [0],
          })
          .groupBy("mt.tagDefinitionId")
          .orderBy("COUNT(*)", "DESC")
          .limit(3)
          .getMany()
      : [];

  // Strategy 3: Find tags from media with similar characteristics (fallback)
  const fallbackTags = await mediaTagRepository
    .createQueryBuilder("mt")
    .leftJoinAndSelect("mt.tag", "tag")
    .leftJoinAndSelect("tag.dimension", "dimension")
    .leftJoin("mt.media", "media")
    .where("mt.tagDefinitionId NOT IN (:...existingTagIds)", {
      existingTagIds: existingTagIds.length > 0 ? existingTagIds : [0],
    })
    .groupBy("mt.tagDefinitionId")
    .orderBy("COUNT(*)", "DESC")
    .limit(2)
    .getMany();

  // Combine recommendations and remove duplicates
  const allRecommendations = [
    ...coOccurringTags.filter((mt) => mt.tag).map((mt) => mt.tag),
    ...popularTagsInDimensions.filter((mt) => mt.tag).map((mt) => mt.tag),
    ...fallbackTags.filter((mt) => mt.tag).map((mt) => mt.tag),
  ];

  const uniqueRecommendations = allRecommendations.filter(
    (tag, index, self) => tag && index === self.findIndex((t) => t?.id === tag.id)
  );

  return uniqueRecommendations.slice(0, 10);
};
