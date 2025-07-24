import { db } from "../../lib/db";
import { CHANNEL_TYPES } from "../channels/channelTypes";
import { Channel } from "../channels/entity";
import { Subreddit } from "../channels/subreddit";
import { Media } from "../library/entity";
import { buildFilterGroupQuery } from "../library/filter-helpers";
import { Post } from "../posts/entity";
import { createPost, fetchPostsByChannel, fetchPostsByMediaId } from "../posts/operations";
import { GeneratedPost, PostToSchedule, RegenerateMediaResult, ScheduledPost } from "./api-type";
import { calculateOptimalScheduleDate } from "./calculate-optimal-date";

const removeHashtagsFromEnd = (caption: string): string => {
  if (!caption) return "";
  return caption.replace(/#[^\s]*(\s+#[^\s]*)*\s*$/, "").trim();
};

const getSubredditPosts = (channelPosts: Post[], subredditId: string): Post[] => {
  return channelPosts.filter((post) => post.subredditId === subredditId);
};

const selectSubreddit = (subreddits: Subreddit[]): Subreddit | null => {
  if (subreddits.length === 0) return null;

  // Simple random selection - constraints are handled by intelligent scheduling
  const randomIndex = Math.floor(Math.random() * subreddits.length);
  return subreddits[randomIndex];
};

const selectRandomMedia = async (
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

const generateCaptionForMedia = async (media: Media): Promise<string> => {
  try {
    const posts = await fetchPostsByMediaId(media.id);

    const postsWithCaptions = posts
      .filter((post) => post.caption && post.caption.trim().length > 0)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const caption = postsWithCaptions.length > 0 ? postsWithCaptions[0].caption || "" : "";
    return removeHashtagsFromEnd(caption);
  } catch (error) {
    console.error("Error generating caption:", error);
    return "";
  }
};

const getMediaFilterForSubreddit = async (
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

export const generateRandomPost = async (
  subreddits: Subreddit[],
  channelId: string
): Promise<GeneratedPost> => {
  const dataSource = await db();
  const channelRepo = dataSource.getRepository(Channel);

  // Validate channel
  const channel = await channelRepo.findOne({
    where: { id: channelId },
    relations: ["type"],
  });

  if (!channel || channel.type.id !== CHANNEL_TYPES.reddit.id) {
    throw new Error("Invalid Reddit channel");
  }

  // Get all existing posts in the channel for scheduling calculations
  const channelPosts = await fetchPostsByChannel(channelId);

  // Select subreddit
  const subreddit = selectSubreddit(subreddits);
  if (!subreddit) {
    throw new Error("No subreddit found");
  }

  // Get posts for this specific subreddit
  const subredditPosts = getSubredditPosts(channelPosts, subreddit.id);

  // Get media filter for subreddit
  const mediaFilter = await getMediaFilterForSubreddit(subreddit, channelId);

  // Select random media
  const { media: selectedMedia } = await selectRandomMedia(mediaFilter);
  if (!selectedMedia) {
    throw new Error("No suitable media found");
  }

  // Generate caption
  const caption = await generateCaptionForMedia(selectedMedia);

  // Calculate optimal schedule date
  const date = calculateOptimalScheduleDate(subreddit, subredditPosts, channelPosts);

  return {
    subreddit,
    media: selectedMedia,
    caption,
    date,
  };
};

export const generatePosts = async (
  count: number,
  subreddits: Subreddit[],
  channelId: string
): Promise<GeneratedPost[]> => {
  const posts: GeneratedPost[] = [];
  const errors: string[] = [];
  const usedSubredditIds = new Set<string>();

  // Get all existing posts in the channel for scheduling calculations
  const channelPosts = await fetchPostsByChannel(channelId);

  // Keep track of posts we're generating to avoid conflicts among them
  const allPosts = [...channelPosts];

  // Generate posts one by one, avoiding duplicate subreddits
  for (let i = 0; i < count; i++) {
    try {
      // Filter out already used subreddits
      const availableSubreddits = subreddits.filter((sub) => !usedSubredditIds.has(sub.id));

      if (availableSubreddits.length === 0) {
        // If we've used all available subreddits, reset the set to allow reuse
        usedSubredditIds.clear();
        availableSubreddits.push(...subreddits);
      }

      // Select subreddit from available ones
      const subreddit = selectSubreddit(availableSubreddits);
      if (!subreddit) {
        errors.push(`Post ${i + 1}: No subreddit found`);
        continue;
      }

      // Get posts for this specific subreddit
      const subredditPosts = getSubredditPosts(allPosts, subreddit.id);

      // Get media filter and select media
      const mediaFilter = await getMediaFilterForSubreddit(subreddit, channelId);
      const { media: selectedMedia } = await selectRandomMedia(mediaFilter);
      if (!selectedMedia) {
        errors.push(`Post ${i + 1}: No suitable media found`);
        continue;
      }

      // Generate caption
      const caption = await generateCaptionForMedia(selectedMedia);

      // Calculate optimal schedule date considering all posts (existing + already generated)
      const date = calculateOptimalScheduleDate(subreddit, subredditPosts, allPosts);

      const generatedPost: GeneratedPost = {
        subreddit,
        media: selectedMedia,
        caption,
        date,
      };

      posts.push(generatedPost);
      usedSubredditIds.add(subreddit.id);

      // Add this post to the allPosts array for future conflict checking
      // Create a mock Post object for scheduling calculations
      allPosts.push({
        id: `temp-${i}`,
        date: date.toISOString(),
        subredditId: subreddit.id,
        channelId,
        status: "scheduled" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Post);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      errors.push(`Post ${i + 1}: ${errorMessage}`);
    }
  }

  if (posts.length === 0) {
    throw new Error(`Failed to generate any posts: ${errors.join(", ")}`);
  }

  return posts;
};

export const regenerateMedia = async (
  subredditId: string,
  channelId: string
): Promise<RegenerateMediaResult> => {
  const dataSource = await db();
  const subredditRepo = dataSource.getRepository(Subreddit);

  // Get the specific subreddit
  const targetSubreddit = await subredditRepo.findOne({
    where: { id: subredditId },
  });

  if (!targetSubreddit) {
    throw new Error("Subreddit not found");
  }

  // Get media filter for subreddit
  const mediaFilter = await getMediaFilterForSubreddit(targetSubreddit, channelId);

  // Select random media
  const { media } = await selectRandomMedia(mediaFilter);
  if (!media) {
    throw new Error("No suitable media found for this subreddit");
  }

  // Generate caption
  const caption = await generateCaptionForMedia(media);

  return {
    media,
    caption,
  };
};

export const scheduleAllPosts = async (
  posts: PostToSchedule[],
  channelId: string
): Promise<string[]> => {
  const createdPostIds: string[] = [];

  for (const postData of posts) {
    try {
      // Use the existing createPost operation
      const post = await createPost(
        {
          channelId,
          subredditId: postData.subredditId,
          status: "scheduled",
          caption: postData.caption,
          date: postData.date.toISOString(), // Convert Date to ISO string
        },
        [postData.mediaId]
      );

      createdPostIds.push(post.id);
    } catch (error) {
      console.error("Error creating scheduled post:", error);
      throw error;
    }
  }

  return createdPostIds;
};

export const getScheduledPosts = async (channelId: string): Promise<ScheduledPost[]> => {
  const dataSource = await db();
  const postRepo = dataSource.getRepository(Post);

  const posts = await postRepo.find({
    where: {
      channelId,
      status: "scheduled",
    },
    relations: ["subreddit", "postMedia", "postMedia.media"],
    order: {
      date: "ASC",
    },
  });

  // Filter for future posts only
  const now = new Date();
  const futurePosts = posts.filter((post) => new Date(post.date) > now);

  return futurePosts.map((post) => ({
    id: post.id,
    subreddit: post.subreddit!,
    media: post.postMedia[0]?.media,
    caption: post.caption || "",
    scheduledDate: post.date,
    createdAt: post.createdAt,
  }));
};
