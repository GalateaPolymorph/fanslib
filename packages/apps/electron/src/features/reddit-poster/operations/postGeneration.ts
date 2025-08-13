import { db } from "../../../lib/db";
import { CHANNEL_TYPES } from "../../channels/channelTypes";
import { Channel } from "../../channels/entity";
import { Subreddit } from "../../channels/subreddit";
import { fetchPostsByChannel } from "../../posts/operations";
import { Post } from "../../posts/entity";
import { calculateOptimalScheduleDate } from "../calculate-optimal-date";
import { GeneratedPost } from "../api-type";
import { selectSubreddit, getSubredditPosts } from "../utils/subredditSelection";
import { generateCaptionForMedia } from "../utils/captionUtils";
import { selectRandomMedia, getMediaFilterForSubreddit } from "./mediaSelection";

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

const generateSinglePost = async (
  availableSubreddits: Subreddit[],
  channelId: string,
  allPosts: Post[],
  index: number
): Promise<{ post: GeneratedPost; subredditId: string }> => {
  // Select subreddit from available ones
  const subreddit = selectSubreddit(availableSubreddits);
  if (!subreddit) {
    throw new Error(`Post ${index + 1}: No subreddit found`);
  }

  // Get posts for this specific subreddit
  const subredditPosts = getSubredditPosts(allPosts, subreddit.id);

  // Get media filter and select media
  const mediaFilter = await getMediaFilterForSubreddit(subreddit, channelId);
  const { media: selectedMedia } = await selectRandomMedia(mediaFilter);
  if (!selectedMedia) {
    throw new Error(`Post ${index + 1}: No suitable media found`);
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

  return { post: generatedPost, subredditId: subreddit.id };
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

      const { post, subredditId } = await generateSinglePost(availableSubreddits, channelId, allPosts, i);
      
      posts.push(post);
      usedSubredditIds.add(subredditId);

      // Add this post to the allPosts array for future conflict checking
      // Create a mock Post object for scheduling calculations
      allPosts.push({
        id: `temp-${i}`,
        date: post.date.toISOString(),
        subredditId: post.subreddit.id,
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