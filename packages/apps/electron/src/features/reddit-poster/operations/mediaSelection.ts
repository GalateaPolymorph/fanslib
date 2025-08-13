import { db } from "../../../lib/db";
import { Media } from "../../library/entity";
import { buildFilterGroupQuery } from "../../library/filter-helpers";
import { Channel } from "../../channels/entity";
import { Subreddit } from "../../channels/subreddit";

export const selectRandomMedia = async (
  filters?: any
): Promise<{ media: Media | null; totalAvailable: number }> => {
  const dataSource = await db();
  const mediaRepo = dataSource.getRepository(Media);

  try {
    // Build query with filters
    const query = mediaRepo.createQueryBuilder("media");

    if (filters) {
      buildFilterGroupQuery(filters, query);
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