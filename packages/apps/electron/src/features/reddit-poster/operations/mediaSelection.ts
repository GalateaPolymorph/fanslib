import { db } from "../../../lib/db";
import { Media } from "../../library/entity";
import { buildFilterGroupQuery } from "../../library/filter-helpers";
import { Channel } from "../../channels/entity";
import { Subreddit } from "../../channels/subreddit";
import { PostMedia } from "../../posts/entity";

const MEDIA_REUSE_RESTRICTION_DAYS = 30;

export const getUsedMediaForSubreddit = async (
  subredditId: string,
  channelId: string,
  restrictionDays: number = MEDIA_REUSE_RESTRICTION_DAYS
): Promise<string[]> => {
  const dataSource = await db();
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - restrictionDays);
  const cutoffDateString = cutoffDate.toISOString();
  
  const usedMediaResults = await dataSource
    .getRepository(PostMedia)
    .createQueryBuilder("postMedia")
    .innerJoin("postMedia.post", "post")
    .innerJoin("postMedia.media", "media")
    .select("media.id")
    .where("post.subredditId = :subredditId", { subredditId })
    .andWhere("post.channelId = :channelId", { channelId })
    .andWhere("post.date >= :cutoffDate", { cutoffDate: cutoffDateString })
    .getRawMany();
  
  return usedMediaResults.map(result => result.media_id);
};

const excludeUsedMediaFromQuery = (
  query: any,
  usedMediaIds: string[]
): void => {
  if (usedMediaIds.length > 0) {
    query.andWhere("media.id NOT IN (:...usedMediaIds)", { usedMediaIds });
  }
};

export const selectRandomMedia = async (
  filters?: any,
  excludeMediaIds?: string[]
): Promise<{ media: Media | null; totalAvailable: number }> => {
  const dataSource = await db();
  const mediaRepo = dataSource.getRepository(Media);

  try {
    // Build query with filters
    const query = mediaRepo.createQueryBuilder("media");

    if (filters) {
      buildFilterGroupQuery(filters, query);
    }

    // Exclude used media if provided
    if (excludeMediaIds) {
      excludeUsedMediaFromQuery(query, excludeMediaIds);
    }

    // Get total count
    const totalAvailable = await query.getCount();

    if (totalAvailable === 0) {
      return { media: null, totalAvailable: 0 };
    }

    // Get random media
    const randomOffset = Math.floor(Math.random() * totalAvailable);
    const media = await query.offset(randomOffset).limit(1).getOne();

    return { media, totalAvailable };
  } catch (error) {
    console.error("Error selecting random media:", error);
    return { media: null, totalAvailable: 0 };
  }
};

export const getMediaFilterForSubreddit = async (
  subreddit: Subreddit,
  channelId: string
): Promise<any> => {
  const dataSource = await db();
  const channelRepo = dataSource.getRepository(Channel);

  const channel = await channelRepo.findOne({
    where: { id: channelId },
    relations: ["type"],
  });

  // Use subreddit filter if available, otherwise fall back to channel filter
  const hasSubredditFilter =
    subreddit.eligibleMediaFilter &&
    Array.isArray(subreddit.eligibleMediaFilter) &&
    subreddit.eligibleMediaFilter.length > 0;

  return hasSubredditFilter ? subreddit.eligibleMediaFilter : channel?.eligibleMediaFilter;
};

export const selectRandomMediaWithConflictChecking = async (
  subreddit: Subreddit,
  channelId: string,
  restrictionDays: number = MEDIA_REUSE_RESTRICTION_DAYS
): Promise<{ media: Media | null; totalAvailable: number; usedMediaCount: number }> => {
  // Get media filter for subreddit
  const filters = await getMediaFilterForSubreddit(subreddit, channelId);
  
  // Get used media for this subreddit
  const usedMediaIds = await getUsedMediaForSubreddit(subreddit.id, channelId, restrictionDays);
  
  // Select random media excluding used ones
  const result = await selectRandomMedia(filters, usedMediaIds);
  
  return {
    ...result,
    usedMediaCount: usedMediaIds.length
  };
};