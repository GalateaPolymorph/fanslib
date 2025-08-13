import { db } from "../../../lib/db";
import { Post } from "../../posts/entity";
import { Media } from "../../library/entity";
import { Subreddit } from "../../channels/subreddit";
import { createPost } from "../../posts/operations";
import { getMediaById } from "../../library/operations";
import { getServerJobs } from "../../server-communication";
import { PostToSchedule, ScheduledPost, RegenerateMediaResult } from "../api-type";
import { generateCaptionForMedia } from "../utils/captionUtils";
import { selectRandomMedia, getMediaFilterForSubreddit } from "./mediaSelection";

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

  // Get local scheduled posts
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

  const localScheduledPosts = futurePosts.map((post) => ({
    id: post.id,
    subreddit: post.subreddit!,
    media: post.postMedia[0]?.media,
    caption: post.caption || "",
    scheduledDate: post.date,
    createdAt: post.createdAt,
  }));

  // Get server queue jobs and convert them to ScheduledPost format
  const serverJobs = getServerJobs();
  const serverScheduledPosts: ScheduledPost[] = [];

  for (const job of serverJobs) {
    if (job.status === "queued" && new Date(job.scheduledTime) > now) {
      // Fetch media if mediaId is available, otherwise use a placeholder
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
      });
    }
  }

  // Combine and sort by scheduled date
  const allScheduledPosts = [...localScheduledPosts, ...serverScheduledPosts].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  return allScheduledPosts;
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