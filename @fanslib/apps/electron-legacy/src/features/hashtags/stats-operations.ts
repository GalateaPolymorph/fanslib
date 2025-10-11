import { db } from "../../lib/db";
import { Hashtag, HashtagChannelStats } from "./entity";

export const incrementHashtagViews = async (
  hashtagId: number,
  channelId: string,
  viewCount: number
): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(HashtagChannelStats);
  const hashtagRepository = dataSource.getRepository(Hashtag);

  // Verify hashtag exists
  const hashtag = await hashtagRepository.findOne({ where: { id: hashtagId } });
  if (!hashtag) {
    throw new Error(`Hashtag with id ${hashtagId} not found`);
  }

  // Find existing stats
  let stats = await repository.findOne({
    where: { hashtagId, channelId },
  });

  if (!stats) {
    // Create new stats if they don't exist
    stats = repository.create({
      hashtagId,
      channelId,
      views: viewCount,
      hashtag, // Set the hashtag relation
    });
  } else {
    // Update existing stats
    stats.views = viewCount;
  }

  // Save stats
  await repository.save(stats);
};

export const getHashtagStats = async (hashtagId: number): Promise<HashtagChannelStats[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(HashtagChannelStats);

  return repository.find({
    where: { hashtagId },
    relations: {
      channel: true,
    },
  });
};
