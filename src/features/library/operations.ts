import { In } from "typeorm";
import { db } from "../../lib/db";
import { Category } from "../categories/entity";
import { Media, MediaWithoutRelations } from "./entity";

export const createMedia = async ({
  path,
  type,
  name,
  size,
  createdAt,
  modifiedAt,
  categoryIds,
}: Omit<MediaWithoutRelations, "id">): Promise<Media> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  const media = new Media();
  media.path = path;
  media.type = type;
  media.name = name;
  media.size = size;
  media.createdAt = createdAt;
  media.modifiedAt = modifiedAt;
  media.isNew = true;
  media.categoryIds = categoryIds;

  return repository.save(media);
};

export const fetchMediaByPath = async (path: string): Promise<Media | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  return repository.findOne({
    where: { path },
    relations: { categories: true },
  });
};

export const fetchAllMedia = async (): Promise<Media[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);

  return repository.find({
    relations: { categories: true },
  });
};

export const fetchMediaByCategory = async (categorySlug: string): Promise<Media[]> => {
  const dataSource = await db();
  return dataSource
    .createQueryBuilder(Media, "media")
    .leftJoinAndSelect("media.categories", "category")
    .where("category.slug = :slug", { slug: categorySlug })
    .getMany();
};

export const updateMediaCategories = async (
  path: string,
  categoryIds: string[]
): Promise<Media | null> => {
  const dataSource = await db();
  const mediaRepo = dataSource.getRepository(Media);
  const categoryRepo = dataSource.getRepository(Category);

  const media = await mediaRepo.findOne({
    where: { path },
    relations: { categories: true },
  });

  if (!media) return null;

  media.categoryIds = categoryIds;
  media.categories = await categoryRepo.findBy({ slug: In(categoryIds) });

  return mediaRepo.save(media);
};

export const updateMedia = async (path: string, updates: Partial<Media>): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);
  await repository.update({ path }, updates);
};

export const deleteMedia = async (path: string): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Media);
  await repository.delete({ path });
};
