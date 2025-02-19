import { db } from "../../lib/db";
import { Hashtag } from "./entity";

const normalizeHashtagName = (name: string): string => {
  return name.startsWith("#") ? name : `#${name}`;
};

export const findOrCreateHashtag = async (name: string): Promise<Hashtag> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Hashtag);
  const normalizedName = normalizeHashtagName(name);

  // Try to find existing hashtag
  const existingHashtag = await repository.findOne({
    where: { name: normalizedName },
  });

  if (existingHashtag) {
    return existingHashtag;
  }

  // Create new hashtag if it doesn't exist
  const hashtag = repository.create({ name: normalizedName });
  return await repository.save(hashtag);
};

export const findOrCreateHashtags = async (names: string[]): Promise<Hashtag[]> => {
  return Promise.all(names.map((name) => findOrCreateHashtag(name)));
};

export const getHashtagsByIds = async (ids: number[]): Promise<Hashtag[]> => {
  if (ids.length === 0) return [];

  const dataSource = await db();
  const repository = dataSource.getRepository(Hashtag);

  return repository.find({
    where: ids.map((id) => ({ id })),
    relations: {
      channelStats: true,
    },
  });
};

export const getAllHashtags = async (): Promise<Hashtag[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Hashtag);

  return repository.find({
    relations: {
      channelStats: true,
    },
  });
};

export const deleteHashtag = async (id: number): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Hashtag);

  await repository.delete({ id });
};
