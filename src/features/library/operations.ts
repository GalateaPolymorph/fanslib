import * as fs from "fs/promises";
import { In } from "typeorm";
import { db } from "../../lib/db";
import { PaginatedResponse } from "../_common/pagination";
import { loadSettings } from "../settings/load";
import { GetAllMediaParams, UpdateMediaPayload } from "./api-type";
import { Media } from "./entity";
import { buildFilterGroupQuery } from "./filter-helpers";
import { convertRelativeToAbsolute } from "./path-utils";

export const createMedia = async ({
  relativePath,
  name,
  type,
  size,
  duration,
  fileCreationDate,
  fileModificationDate,
}: {
  relativePath: string;
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
    relativePath,
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
      postMedia: {
        post: {
          channel: true,
          subreddit: true,
        },
      },
      mediaTags: true,
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
    .leftJoinAndSelect("media.postMedia", "postMedia")
    .leftJoinAndSelect("postMedia.post", "post")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.subreddit", "subreddit");

  // Apply unified filter group system
  if (params?.filters) {
    buildFilterGroupQuery(params.filters, queryBuilder);
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

export const fetchMediaByPath = async (relativePath: string): Promise<Media | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  return repository.findOne({
    where: { relativePath },
    relations: {
      postMedia: {
        post: {
          channel: true,
        },
      },
    },
  });
};

export const fetchMediaByPaths = async (relativePaths: string[]): Promise<Media[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  return repository.find({
    where: { relativePath: In(relativePaths) },
    relations: {
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
      const settings = await loadSettings();
      const filePath = convertRelativeToAbsolute(media.relativePath, settings.libraryPath);
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Failed to delete file:", error);
      // Don't throw since we already deleted from DB
    }
  }
};

export const findAdjacentMedia = async (
  mediaId: string,
  params?: GetAllMediaParams
): Promise<{ previous: Media | null; next: Media | null }> => {
  const database = await db();

  // First, get the current media to understand its position
  const currentMedia = await database.manager.findOne(Media, {
    where: { id: mediaId },
  });

  if (!currentMedia) {
    return { previous: null, next: null };
  }

  // Build the base query with the same filters and sorting as the library
  const buildQuery = () => {
    const queryBuilder = database.manager
      .createQueryBuilder(Media, "media")
      .leftJoinAndSelect("media.postMedia", "postMedia")
      .leftJoinAndSelect("postMedia.post", "post")
      .leftJoinAndSelect("post.channel", "channel")
      .leftJoinAndSelect("post.subreddit", "subreddit");

    // Apply the same filters as the library
    if (params?.filters) {
      buildFilterGroupQuery(params.filters, queryBuilder);
    }

    return queryBuilder;
  };

  // Determine sort field and direction
  const sortField = params?.sort?.field || "fileModificationDate";
  const sortDirection = params?.sort?.direction || "DESC";

  let previousCondition: string;
  let nextCondition: string;
  let currentValue: any;

  // Build conditions based on sort field
  switch (sortField) {
    case "fileModificationDate":
    case "fileCreationDate":
      currentValue = currentMedia[sortField];
      if (sortDirection === "DESC") {
        previousCondition = `media.${sortField} > :currentValue`;
        nextCondition = `media.${sortField} < :currentValue`;
      } else {
        previousCondition = `media.${sortField} < :currentValue`;
        nextCondition = `media.${sortField} > :currentValue`;
      }
      break;
    case "lastPosted": {
      // For lastPosted, we need to get the max post date for the current media
      const lastPostedQuery = await database.manager
        .createQueryBuilder()
        .select("MAX(p.date)", "lastPostDate")
        .from("post", "p")
        .innerJoin("post.postMedia", "pm")
        .where("pm.mediaId = :mediaId", { mediaId })
        .getRawOne();

      currentValue = lastPostedQuery?.lastPostDate;
      if (sortDirection === "DESC") {
        previousCondition = currentValue
          ? `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) > :currentValue`
          : `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) IS NOT NULL`;
        nextCondition = currentValue
          ? `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) < :currentValue OR (SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) IS NULL`
          : `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) IS NULL AND media.id < :mediaId`;
      } else {
        previousCondition = currentValue
          ? `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) < :currentValue OR (SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) IS NULL`
          : `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) IS NULL AND media.id > :mediaId`;
        nextCondition = currentValue
          ? `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) > :currentValue`
          : `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id) IS NOT NULL`;
      }
      break;
    }
    case "random":
      // For random sort, we can't really determine previous/next in a meaningful way
      // So we'll fall back to creation date
      currentValue = currentMedia.fileCreationDate;
      previousCondition = `media.fileCreationDate > :currentValue`;
      nextCondition = `media.fileCreationDate < :currentValue`;
      break;
  }

  const [previous, next] = await Promise.all([
    // Find previous media
    buildQuery()
      .where(previousCondition, currentValue ? { currentValue, mediaId } : { mediaId })
      .orderBy(
        sortField === "lastPosted"
          ? `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id)`
          : `media.${sortField}`,
        sortDirection === "DESC" ? "ASC" : "DESC"
      )
      .limit(1)
      .getOne(),

    // Find next media
    buildQuery()
      .where(nextCondition, currentValue ? { currentValue, mediaId } : { mediaId })
      .orderBy(
        sortField === "lastPosted"
          ? `(SELECT MAX(p.date) FROM post p INNER JOIN post_media pm ON p.id = pm.postId WHERE pm.mediaId = media.id)`
          : `media.${sortField}`,
        sortDirection
      )
      .limit(1)
      .getOne(),
  ]);

  return { previous, next };
};
