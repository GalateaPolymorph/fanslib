import * as fs from "fs/promises";
import { In } from "typeorm";
import { db } from "../../lib/db";
import { PaginatedResponse } from "../_common/pagination";
import { Niche } from "../niches/entity";
import { GetAllMediaParams, UpdateMediaPayload } from "./api-type";
import { Media } from "./entity";

export const createMedia = async ({
  path,
  name,
  type,
  size,
  duration,
  fileCreationDate,
  fileModificationDate,
}: {
  path: string;
  name: string;
  type: "image" | "video";
  size: number;
  duration?: number;
  fileCreationDate: Date;
  fileModificationDate: Date;
}) => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  const media = repository.create({
    path,
    name,
    type,
    size,
    duration,
    fileCreationDate,
    fileModificationDate,
  });

  return repository.save(media);
};

export const getMediaById = async (id: string): Promise<Media | null> => {
  const database = await db();
  return database.manager.findOne(Media, {
    where: { id },
    relations: {
      categories: true,
      postMedia: {
        post: {
          channel: true,
          subreddit: true,
        },
      },
      niches: {
        hashtags: true,
      },
      tier: true,
    },
  });
};

export const fetchAllMedia = async (
  params?: GetAllMediaParams
): Promise<PaginatedResponse<Media>> => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;
  const skip = (page - 1) * limit;

  const database = await db();
  const queryBuilder = database.manager
    .createQueryBuilder(Media, "media")
    .leftJoinAndSelect("media.categories", "categories")
    .leftJoinAndSelect("media.postMedia", "postMedia")
    .leftJoinAndSelect("postMedia.post", "post")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.subreddit", "subreddit")
    .leftJoinAndSelect("media.niches", "niches")
    .leftJoinAndSelect("niches.hashtags", "hashtags")
    .leftJoinAndSelect("media.tier", "tier");

  // Apply category filter
  if (params?.categories?.length) {
    queryBuilder.andWhere("categories.id IN (:...categories)", { categories: params.categories });
  }

  // Apply category empty filter
  if (params?.categories?.length === 0) {
    queryBuilder.andWhere("categories.id IS NULL");
  }

  // Apply search filter
  if (params?.search) {
    queryBuilder.andWhere("LOWER(media.path) LIKE LOWER(:search)", {
      search: `%${params.search}%`,
    });
  }

  // Apply caption filter
  if (params?.caption) {
    queryBuilder.andWhere(
      "EXISTS (SELECT 1 FROM post_media pm JOIN post p ON p.id = pm.postId WHERE pm.mediaId = media.id AND LOWER(p.caption) LIKE LOWER(:caption))",
      { caption: `%${params.caption}%` }
    );
  }

  // Apply unposted filter
  if (params?.unposted) {
    queryBuilder.andWhere("postMedia.id IS NULL");
  }

  // Apply exclude shoots filter
  if (params?.excludeShoots?.length) {
    queryBuilder.leftJoin("media.shoots", "shoots");

    if (params.excludeShoots.includes("__all__")) {
      // Return only media without any shoots
      queryBuilder.andWhere(
        "NOT EXISTS (SELECT 1 FROM shoot_media sm WHERE sm.media_id = media.id)"
      );
    } else {
      // Normal case: exclude specific shoots
      queryBuilder.andWhere(
        "NOT EXISTS (SELECT 1 FROM shoot_media sm WHERE sm.media_id = media.id AND sm.shoot_id IN (:...excludeShoots))",
        { excludeShoots: params.excludeShoots }
      );
    }
  }

  // Apply shootId filter
  if (params?.shootId) {
    queryBuilder.leftJoin("media.shoots", "shoots");
    queryBuilder.andWhere(
      "EXISTS (SELECT 1 FROM shoot_media sm WHERE sm.media_id = media.id AND sm.shoot_id = :shootId)",
      { shootId: params.shootId }
    );
  }

  // Apply date range filters
  if (params?.createdDateStart) {
    queryBuilder.andWhere("media.fileCreationDate >= :startDate", {
      startDate: params.createdDateStart,
    });
  }
  if (params?.createdDateEnd) {
    queryBuilder.andWhere("media.fileCreationDate <= :endDate", {
      endDate: params.createdDateEnd,
    });
  }

  // Apply channel filters
  if (params?.channelFilters?.length) {
    params.channelFilters.forEach((filter, index) => {
      if (filter.posted) {
        // Media that HAS been posted in the specific channel
        queryBuilder.andWhere(
          `EXISTS (
            SELECT 1 FROM post_media pm
            JOIN post p ON p.id = pm.postId
            WHERE pm.mediaId = media.id
            AND p.channelId = :channelId${index}
          )`,
          { [`channelId${index}`]: filter.channelId }
        );
      } else {
        // Media that has NOT been posted in the specific channel
        queryBuilder.andWhere(
          `NOT EXISTS (
            SELECT 1 FROM post_media pm
            JOIN post p ON p.id = pm.postId
            WHERE pm.mediaId = media.id
            AND p.channelId = :channelId${index}
          )`,
          { [`channelId${index}`]: filter.channelId }
        );
      }
    });
  }

  // Apply subreddit filters
  if (params?.subredditFilters?.length) {
    params.subredditFilters.forEach((filter, index) => {
      if (filter.posted) {
        // Media that HAS been posted in the specific subreddit
        queryBuilder.andWhere(
          `EXISTS (
            SELECT 1 FROM post_media pm
            JOIN post p ON p.id = pm.postId
            WHERE pm.mediaId = media.id
            AND p.subredditId = :subredditId${index}
            AND p.status = 'posted'
          )`,
          { [`subredditId${index}`]: filter.subredditId }
        );
      } else {
        // Media that has NOT been posted in the specific subreddit
        queryBuilder.andWhere(
          `NOT EXISTS (
            SELECT 1 FROM post_media pm
            JOIN post p ON p.id = pm.postId
            WHERE pm.mediaId = media.id
            AND p.status = 'posted'
            AND p.subredditId = :subredditId${index}
          )`,
          { [`subredditId${index}`]: filter.subredditId }
        );
      }
    });
  }

  // Apply tier filters
  if (params?.tiers?.length) {
    queryBuilder.andWhere("tier.id IN (:...tiers)", { tiers: params.tiers });
  }

  // Apply tier none filter
  if (params?.tiers?.length === 0) {
    queryBuilder.andWhere("tier.id IS NULL");
  }

  // Apply tag-based filters using denormalized MediaTag fields for performance
  if (params?.tagFilters) {
    Object.entries(params.tagFilters).forEach(([dimensionName, filter], index) => {
      const paramPrefix = `tagFilter${index}`;

      if (filter.tagIds?.length) {
        const operator = filter.operator === "OR" ? "OR" : "AND";

        if (operator === "AND") {
          // For AND operation, media must have ALL specified tags in this dimension
          filter.tagIds.forEach((tagId, tagIndex) => {
            queryBuilder.andWhere(
              `EXISTS (
                SELECT 1 FROM media_tag mt${index}_${tagIndex} 
                WHERE mt${index}_${tagIndex}.mediaId = media.id 
                AND mt${index}_${tagIndex}.dimensionName = :${paramPrefix}DimName 
                AND mt${index}_${tagIndex}.tagDefinitionId = :${paramPrefix}TagId${tagIndex}
              )`,
              {
                [`${paramPrefix}DimName`]: dimensionName,
                [`${paramPrefix}TagId${tagIndex}`]: tagId,
              }
            );
          });
        } else {
          // For OR operation, media must have ANY of the specified tags in this dimension
          queryBuilder.andWhere(
            `EXISTS (
              SELECT 1 FROM media_tag mt${index} 
              WHERE mt${index}.mediaId = media.id 
              AND mt${index}.dimensionName = :${paramPrefix}DimName 
              AND mt${index}.tagDefinitionId IN (:...${paramPrefix}TagIds)
            )`,
            {
              [`${paramPrefix}DimName`]: dimensionName,
              [`${paramPrefix}TagIds`]: filter.tagIds,
            }
          );
        }
      }

      // Handle "none" filter (empty array means no tags in this dimension)
      if (filter.tagIds?.length === 0) {
        queryBuilder.andWhere(
          `NOT EXISTS (
            SELECT 1 FROM media_tag mt${index} 
            WHERE mt${index}.mediaId = media.id 
            AND mt${index}.dimensionName = :${paramPrefix}DimName
          )`,
          { [`${paramPrefix}DimName`]: dimensionName }
        );
      }

      // Handle value-based filtering for numerical/boolean dimensions
      if (filter.values?.length) {
        queryBuilder.andWhere(
          `EXISTS (
            SELECT 1 FROM media_tag mt${index} 
            WHERE mt${index}.mediaId = media.id 
            AND mt${index}.dimensionName = :${paramPrefix}DimName 
            AND mt${index}.tagValue IN (:...${paramPrefix}Values)
          )`,
          {
            [`${paramPrefix}DimName`]: dimensionName,
            [`${paramPrefix}Values`]: filter.values,
          }
        );
      }
    });
  }

  // Apply sorting
  if (params?.sort) {
    const { field, direction } = params.sort;
    switch (field) {
      case "fileModificationDate":
      case "fileCreationDate":
        queryBuilder.orderBy(`media.${field}`, direction);
        break;
      case "lastPosted":
        queryBuilder
          .addSelect(
            (subQuery) =>
              subQuery
                .select("MAX(p.date)")
                .from("post", "p")
                .innerJoin("post.postMedia", "pm")
                .where("pm.mediaId = media.id"),
            "lastPostDate"
          )
          .orderBy("lastPostDate", direction, "NULLS LAST");
        break;
      case "random":
        queryBuilder.orderBy("RANDOM() * unixepoch()", direction);
        break;
    }
  } else {
    // Default sort by modification date, newest first
    queryBuilder.orderBy("media.fileModificationDate", "DESC");
  }

  const [items, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const fetchMediaByPath = async (path: string): Promise<Media | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  return repository.findOne({
    where: { path },
    relations: {
      categories: true,
      postMedia: {
        post: {
          channel: true,
        },
      },
    },
  });
};

export const fetchMediaByPaths = async (paths: string[]): Promise<Media[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  return repository.find({
    where: { path: In(paths) },
    relations: {
      categories: true,
      postMedia: {
        post: {
          channel: true,
        },
      },
    },
  });
};

export const updateMedia = async (id: string, updates: UpdateMediaPayload) => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  const media = await repository.findOne({
    where: { id },
    relations: {
      categories: true,
      postMedia: {
        post: {
          channel: true,
        },
      },
      shoots: true,
    },
  });

  if (!media) return null;

  Object.assign(media, updates);

  await repository.save(media);

  const newMedia = await repository.findOne({
    where: { id },
    relations: {
      categories: true,
      postMedia: true,
      shoots: true,
    },
  });

  return newMedia;
};

export const deleteMedia = async (id: string, deleteFile = false) => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  // Get the media path before deleting if we need to delete the file
  const media = deleteFile ? await repository.findOneBy({ id }) : null;

  await repository.delete({ id });

  // Delete the file if requested
  if (deleteFile && media) {
    try {
      await fs.unlink(media.path);
    } catch (error) {
      console.error("Failed to delete file:", error);
      // Don't throw since we already deleted from DB
    }
  }
};

export const updateMediaNiches = async (mediaId: string, nicheIds: number[]): Promise<Media> => {
  const dataSource = await db();
  const mediaRepository = dataSource.getRepository(Media);
  const nicheRepository = dataSource.getRepository(Niche);

  const media = await mediaRepository.findOne({
    where: { id: mediaId },
    relations: { niches: true },
  });

  if (!media) {
    throw new Error(`Media with id ${mediaId} not found`);
  }

  media.niches = await nicheRepository.findBy({ id: In(nicheIds) });
  return mediaRepository.save(media);
};
