import { db } from "../../../lib/db";
import { Subreddit } from "../../channels/subreddit";
import { Media } from "../../library/entity";
import { getMediaById } from "../../library/operations";
import { checkServerAvailability, getServerJobs, schedulePostsToServer } from "../../server-communication";
import { GeneratedPost, RegenerateMediaResult, ScheduledPost } from "../api-type";
import { generateCaptionForMedia } from "../utils/captionUtils";
import { getMediaFilterForSubreddit, selectRandomMedia } from "./mediaSelection";

export type BatchSchedulingResult = {
  successful: string[];
  failed: Array<{ postId: string; message: string }>;
  totalAttempted: number;
};

export const scheduleAllPosts = async (posts: GeneratedPost[]): Promise<string[]> => {
  try {
    const serverJobs = await schedulePostsToServer(posts);
    return serverJobs.map((job) => job.id);
  } catch (error) {
    console.error("Error scheduling posts to server:", error);
    throw error instanceof Error ? error : new Error("Failed to schedule posts to server");
  }
};

export const getScheduledPosts = async (): Promise<ScheduledPost[]> => {
  // Get server queue jobs and convert them to ScheduledPost format
  const serverJobs = getServerJobs();
  const serverScheduledPosts: ScheduledPost[] = [];

  for (const job of serverJobs) {
    // Filter out completed posts - hide posted jobs from normal view
    if (job.status === "posted") {
      continue;
    }

    let media: Media | null = null;
    if (job.mediaId) {
      media = await getMediaById(job.mediaId);
    }

    // Skip jobs without valid media (can't display properly)
    if (!media) {
      continue;
    }

    serverScheduledPosts.push({
      id: `server-${job.id}`, // Prefix to distinguish from local posts
      subreddit: { name: job.subreddit } as Subreddit, // Create minimal subreddit object
      media,
      caption: job.caption,
      scheduledDate: job.scheduledTime,
      createdAt: job.createdAt,
      serverJobId: job.id, // Add reference to server job
      status: job.status, // Add queue status
      errorMessage: job.errorMessage || undefined,
      postUrl: job.postUrl || undefined,
    });
  }

  // Sort by scheduled date
  const sortedServerPosts = serverScheduledPosts.sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  return sortedServerPosts;
};

export const regenerateMedia = async (
  subredditId: string,
  channelId: string
): Promise<RegenerateMediaResult> => {
  try {
    const dataSource = await db();
    const subredditRepo = dataSource.getRepository(Subreddit);

    const targetSubreddit = await subredditRepo.findOne({
      where: { id: subredditId },
    });

    if (!targetSubreddit) {
      throw new Error("Subreddit not found");
    }

    const mediaFilter = await getMediaFilterForSubreddit(targetSubreddit, channelId);

    const { media } = await selectRandomMedia(mediaFilter);
    if (!media) {
      throw new Error("No suitable media found for this subreddit");
    }

    const caption = await generateCaptionForMedia(media);

    return {
      media,
      caption,
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to regenerate media");
  }
};

export const scheduleIndividualPostWithRetry = async (post: GeneratedPost): Promise<void> => {
  const isAvailable = await checkServerAvailability();
  if (!isAvailable) {
    throw new Error("Server is currently unavailable");
  }

  await schedulePostsToServer([post]);
};

export const scheduleBatchPostsWithRetry = async (
  posts: GeneratedPost[]
): Promise<BatchSchedulingResult> => {
  const result: BatchSchedulingResult = {
    successful: [],
    failed: [],
    totalAttempted: posts.length,
  };

  const isAvailable = await checkServerAvailability();
  if (!isAvailable) {
    const serverUnavailableFailures = posts.map((post) => ({
      postId: post.id,
      message: "Server is currently unavailable",
    }));
    
    return {
      ...result,
      failed: serverUnavailableFailures,
    };
  }

  // Use functional approach instead of for-loop
  const schedulingResults = await Promise.allSettled(
    posts.map(async (post) => {
      await schedulePostsToServer([post]);
      return post.id;
    })
  );

  const processResult = (result: PromiseSettledResult<string>, index: number) => {
    const post = posts[index];
    
    if (result.status === "fulfilled") {
      return { type: "success" as const, postId: result.value };
    }
    
    return {
      type: "failure" as const,
      postId: post.id,
      message: result.reason instanceof Error ? result.reason.message : "Unknown error",
    };
  };

  const processedResults = schedulingResults.map(processResult);

  return {
    successful: processedResults
      .filter((r) => r.type === "success")
      .map((r) => r.postId),
    failed: processedResults
      .filter((r) => r.type === "failure")
      .map((r) => ({ postId: r.postId, message: r.message })),
    totalAttempted: posts.length,
  };
};
