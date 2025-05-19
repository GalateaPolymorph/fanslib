import { FanslyAnalyticsResponse } from "../../lib/fansly-analytics/fansly-analytics-response";
import { db } from "../../lib/db";
import { Hashtag, HashtagChannelStats } from "./entity";

type TagData = {
  id: string;
  tag: string;
  viewCount: number;
};

const normalizeHashtagName = (name: string): string => {
  return name.startsWith("#") ? name : `#${name}`;
};

export const findOrCreateHashtag = async (name: string): Promise<Hashtag> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Hashtag);
  const normalizedName = normalizeHashtagName(name);

  const existingHashtag = await repository.findOne({
    where: { name: normalizedName },
  });

  if (existingHashtag) {
    return existingHashtag;
  }

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

export const saveHashtagsFromAnalytics = async (
  channelId: string,
  response: FanslyAnalyticsResponse
): Promise<HashtagChannelStats[]> => {
  const dataSource = await db();
  const hashtagRepo = dataSource.getRepository(Hashtag);
  const statsRepo = dataSource.getRepository(HashtagChannelStats);

  if (
    !response.response.aggregationData?.tags ||
    !Array.isArray(response.response.aggregationData.tags)
  ) {
    return [];
  }

  const tags: TagData[] = response.response.aggregationData.tags.filter(
    (tag) => tag && typeof tag.tag === "string" && tag.tag.trim() !== "" && tag.viewCount > 0
  );

  const savedStats = (
    await Promise.all(
      tags.map(async (tagData) => {
        let hashtag = await hashtagRepo.findOne({
          where: { name: tagData.tag },
          relations: ["channelStats"],
        });

        if (!hashtag) {
          hashtag = hashtagRepo.create({ name: tagData.tag });
          hashtag = await hashtagRepo.save(hashtag);
        }

        const existingStats = await statsRepo.findOne({
          where: {
            hashtagId: hashtag.id,
            channelId,
          },
        });
        if (existingStats) {
          existingStats.views = tagData.viewCount;
          return statsRepo.save(existingStats);
        }

        const newStats = statsRepo.create({
          hashtag,
          hashtagId: hashtag.id,
          channelId,
          views: tagData.viewCount,
        });
        return statsRepo.save(newStats);
      })
    )
  ).filter(Boolean);

  return savedStats;
};
