import { db } from "../../../lib/db";
import { CHANNEL_TYPES } from "../../channels/channelTypes";
import { Channel } from "../../channels/entity";
import { Subreddit } from "../../channels/subreddit";
import { Post } from "../../posts/entity";
import { fetchPostsByChannel } from "../../posts/operations";
import { GeneratedPost } from "../api-type";
import { calculateOptimalScheduleDate } from "../calculate-optimal-date";
import { generateCaptionForMedia } from "../utils/captionUtils";
import { getSubredditPosts, selectSubreddit } from "../utils/subredditSelection";
import { selectRandomMediaWithConflictChecking } from "./mediaSelection";
import { getServerJobs } from "../../server-communication";
import { QueueJobResponse } from "../../server-communication/types";

const findSubredditIdByName = async (subredditName: string): Promise<string | null> => {
  const dataSource = await db();
  const subredditRepo = dataSource.getRepository(Subreddit);
  
  const subreddit = await subredditRepo.findOne({
    where: { name: subredditName }
  });
  
  return subreddit?.id || null;
};

const convertServerJobsToPosts = async (
  jobs: QueueJobResponse[],
  channelId: string
): Promise<Post[]> => {
  const activeJobs = jobs.filter(job => 
    job.status === 'queued' || job.status === 'processing'
  );
  
  const convertedPosts: Post[] = [];
  
  for (const job of activeJobs) {
    const subredditId = await findSubredditIdByName(job.subreddit);
    
    // Skip jobs for subreddits that don't exist locally
    if (!subredditId) {
      continue;
    }
    
    convertedPosts.push({
      id: `server-${job.id}`,
      date: job.scheduledTime,
      subredditId,
      channelId,
      status: 'scheduled' as const,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      caption: job.caption,
      url: job.url || undefined,
    } as Post);
  }
  
  return convertedPosts;
};

const getCombinedPosts = async (channelId: string): Promise<Post[]> => {
  // Get local posts
  const localPosts = await fetchPostsByChannel(channelId);
  
  // Get server jobs and convert to posts
  const serverJobs = await getServerJobs();
  const serverPosts = await convertServerJobsToPosts(serverJobs, channelId);
  
  return [...localPosts, ...serverPosts];
};

const validateGenerationInputs = (count: number, subreddits: Subreddit[], channelId: string): void => {
  if (count <= 0) {
    throw new Error("Count must be greater than 0");
  }
  if (subreddits.length === 0) {
    throw new Error("No subreddits provided");
  }
  if (!channelId) {
    throw new Error("Channel ID is required");
  }
};

const createMockPostForScheduling = (
  post: GeneratedPost, 
  index: number, 
  channelId: string
): Post => ({
  id: `temp-${index}`,
  date: post.date.toISOString(),
  subredditId: post.subreddit.id,
  channelId,
  status: "scheduled" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as Post);

const handleSubredditReuse = (
  availableSubreddits: Subreddit[],
  usedSubredditIds: Set<string>,
  allSubreddits: Subreddit[]
): Subreddit[] => {
  if (availableSubreddits.length === 0) {
    // If we've used all available subreddits, reset the set to allow reuse
    usedSubredditIds.clear();
    return [...allSubreddits];
  }
  return availableSubreddits;
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

  // Get all existing posts in the channel for scheduling calculations (including server jobs)
  const channelPosts = await getCombinedPosts(channelId);

  // Select subreddit
  const subreddit = selectSubreddit(subreddits);
  if (!subreddit) {
    throw new Error("No subreddit found");
  }

  // Get posts for this specific subreddit
  const subredditPosts = getSubredditPosts(channelPosts, subreddit.id);

  // Select random media with conflict checking
  const { media: selectedMedia } = await selectRandomMediaWithConflictChecking(subreddit, channelId);
  if (!selectedMedia) {
    throw new Error("No suitable media found");
  }

  // Generate caption
  const caption = await generateCaptionForMedia(selectedMedia);

  // Calculate optimal schedule date
  const date = calculateOptimalScheduleDate(subreddit, subredditPosts, channelPosts);

  return {
    id: crypto.randomUUID(),
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

  // Select media with conflict checking
  const { media: selectedMedia } = await selectRandomMediaWithConflictChecking(subreddit, channelId);
  if (!selectedMedia) {
    throw new Error(`Post ${index + 1}: No suitable media found`);
  }

  // Generate caption
  const caption = await generateCaptionForMedia(selectedMedia);

  // Calculate optimal schedule date considering all posts (existing + already generated)
  const date = calculateOptimalScheduleDate(subreddit, subredditPosts, allPosts);

  const generatedPost: GeneratedPost = {
    id: crypto.randomUUID(),
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
  // Validate inputs
  validateGenerationInputs(count, subreddits, channelId);
  
  const posts: GeneratedPost[] = [];
  const errors: string[] = [];
  const usedSubredditIds = new Set<string>();

  // Get all existing posts in the channel for scheduling calculations (including server jobs)
  const channelPosts = await getCombinedPosts(channelId);

  // Generate posts using functional approach
  type GenerationAccumulator = {
    generatedPosts: GeneratedPost[];
    errors: string[];
    usedSubredditIds: Set<string>;
    allPosts: Post[];
  };

  const result = await Array.from({ length: count })
    .reduce(
      async (accPromise: Promise<GenerationAccumulator>, _, index) => {
        const acc = await accPromise;
        
        try {
          // Filter out already used subreddits
          const filteredSubreddits = subreddits.filter((sub) => !acc.usedSubredditIds.has(sub.id));
          const availableSubreddits = handleSubredditReuse(filteredSubreddits, acc.usedSubredditIds, subreddits);

          const { post, subredditId } = await generateSinglePost(
            availableSubreddits,
            channelId,
            acc.allPosts,
            index
          );

          acc.generatedPosts.push(post);
          acc.usedSubredditIds.add(subredditId);

          // Add this post to the allPosts array for future conflict checking
          acc.allPosts.push(createMockPostForScheduling(post, index, channelId));
          
          return acc;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          acc.errors.push(`Post ${index + 1}: ${errorMessage}`);
          return acc;
        }
      },
      Promise.resolve({
        generatedPosts: [] as GeneratedPost[],
        errors: [] as string[],
        usedSubredditIds,
        allPosts: [...channelPosts]
      } as GenerationAccumulator)
    );

  posts.push(...(result as GenerationAccumulator).generatedPosts);
  errors.push(...(result as GenerationAccumulator).errors);

  if (posts.length === 0) {
    throw new Error(`Failed to generate any posts: ${errors.join(", ")}`);
  }

  return posts;
};
