import { In } from "typeorm";
import { db } from "../../lib/db";
import { Category } from "../categories/entity";
import { GetAllMediaParams, PaginatedResponse } from "./api-type";
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
    relations: ["categories", "postMedia"],
  });
};

export const fetchAllMedia = async ({
  page = 1,
  limit = 50,
  filters,
}: GetAllMediaParams): Promise<PaginatedResponse<Media>> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  const query = repository
    .createQueryBuilder("media")
    .leftJoinAndSelect("media.categories", "category")
    .leftJoinAndSelect("media.postMedia", "postMedia")
    .leftJoinAndSelect("postMedia.post", "post")
    .leftJoinAndSelect("post.channel", "channel");

  if (filters?.categories?.length) {
    query.andWhere("category.slug IN (:...categories)", { categories: filters.categories });
  }

  const [items, total] = await Promise.all([
    query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany(),
    query.getCount(),
  ]);

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

export const updateMedia = async (path: string, updates: Partial<Omit<Media, "id" | "posts">>) => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  const media = await repository.findOne({
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

  if (!media) return null;

  Object.assign(media, updates);

  // Update categories if provided
  if (updates.categories) {
    await addCategoriesToMedia(media, updates.categories);
  }

  await repository.save(media);

  return media;
};

export const deleteMedia = async (path: string) => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  await repository.delete({ path });
};

export const addCategoriesToMediaByPath = async (path: string, categories: Category[]) => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  const media = await repository.findOne({
    where: { path },
    relations: ["categories"],
  });

  if (!media) return null;

  return addCategoriesToMedia(media, categories);
};

const addCategoriesToMedia = async (media: Media, categories: Category[]) => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  media.categories = [...(media.categories || []), ...categories];

  return repository.save(media);
};

export const removeCategoriesFromMedia = async (path: string, categoryIds: string[]) => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  const media = await repository.findOne({
    where: { path },
    relations: ["categories"],
  });

  if (!media) {
    throw new Error("Media not found");
  }

  media.categories = media.categories.filter((cat) => !categoryIds.includes(cat.id));
  return repository.save(media);
};
