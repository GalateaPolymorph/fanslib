import { db } from "../../lib/db";
import { CHANNEL_TYPES } from "../channels/channelTypes";
import { Subreddit } from "../channels/subreddit";
import { Media } from "../library/entity";
import { createPost } from "../posts/operations";
import { PostCreateData } from "../posts/api-type";
import { checkServerAvailability } from "./api-client";
import { QueueJobResponse } from "./types";

const fetchCompletedJobs = async (): Promise<QueueJobResponse[]> => {
  const isAvailable = await checkServerAvailability();
  if (!isAvailable) {
    console.log("⚠️ Server not available for job sync");
    return [];
  }

  try {
    const response = await fetch("http://localhost:3000/api/reddit/queue/completed-for-electron");
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.jobs || [];
  } catch (error) {
    console.error("❌ Failed to fetch completed jobs:", error);
    return [];
  }
};

const markJobAsProcessed = async (jobId: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/api/reddit/queue/${jobId}/mark-processed`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`❌ Failed to mark job ${jobId} as processed:`, error);
    throw error;
  }
};

const findRedditChannelId = async (): Promise<string | null> => {
  const dataSource = await db();
  const channelRepo = dataSource.getRepository("Channel");

  const redditChannel = await channelRepo
    .createQueryBuilder("channel")
    .leftJoinAndSelect("channel.type", "type")
    .where("type.id = :typeId", { typeId: CHANNEL_TYPES.reddit.id })
    .getOne();

  return redditChannel?.id || null;
};

const findSubredditByName = async (subredditName: string): Promise<string | null> => {
  const dataSource = await db();
  const subredditRepo = dataSource.getRepository(Subreddit);

  const subreddit = await subredditRepo.findOne({
    where: { name: subredditName },
  });

  return subreddit?.id || null;
};

const findMediaById = async (mediaId: string): Promise<boolean> => {
  if (!mediaId) return false;
  
  const dataSource = await db();
  const mediaRepo = dataSource.getRepository(Media);
  
  const media = await mediaRepo.findOne({
    where: { id: mediaId },
  });
  
  return !!media;
};

const convertJobToPostData = async (job: QueueJobResponse): Promise<PostCreateData | null> => {
  // Find Reddit channel
  const channelId = await findRedditChannelId();
  if (!channelId) {
    console.warn(`⚠️ No Reddit channel found for job ${job.id}`);
    return null;
  }

  // Find subreddit
  const subredditId = await findSubredditByName(job.subreddit);
  if (!subredditId) {
    console.warn(`⚠️ Subreddit '${job.subreddit}' not found for job ${job.id}`);
    return null;
  }

  // Validate media exists (optional)
  if (job.mediaId) {
    const mediaExists = await findMediaById(job.mediaId);
    if (!mediaExists) {
      console.warn(`⚠️ Media '${job.mediaId}' not found for job ${job.id}`);
      // Continue without media for now
    }
  }

  // Convert scheduled time from UTC to proper date string
  // The job.scheduledTime is in "YYYY-MM-DD HH:mm:ss" format (UTC)
  // We need to add 'Z' to make it properly UTC and let the UI handle timezone conversion
  const scheduledDate = job.scheduledTime.includes('T') || job.scheduledTime.includes('Z') 
    ? job.scheduledTime 
    : job.scheduledTime.replace(' ', 'T') + 'Z';

  return {
    date: scheduledDate,
    channelId,
    caption: job.caption,
    status: "posted",
    url: job.postUrl || undefined,
    subredditId,
    // Note: We're not adding mediaIds here because the relationship
    // would need to be created separately if we want to link them
  };
};

export const syncCompletedJobs = async (): Promise<number> => {
  try {
    console.log("🔄 Syncing completed Reddit jobs...");
    
    const jobs = await fetchCompletedJobs();
    if (jobs.length === 0) {
      console.log("✅ No new completed jobs to sync");
      return 0;
    }

    console.log(`📥 Found ${jobs.length} completed job(s) to sync`);
    
    let createdCount = 0;
    
    for (const job of jobs) {
      try {
        const postData = await convertJobToPostData(job);
        if (!postData) {
          console.warn(`⚠️ Skipping job ${job.id} - unable to convert to post data`);
          continue;
        }

        // Create post with media if available
        const mediaIds = job.mediaId ? [job.mediaId] : [];
        await createPost(postData, mediaIds);
        
        // Mark as processed on server
        await markJobAsProcessed(job.id);
        
        console.log(`✅ Created post for Reddit job ${job.id} (${job.subreddit})`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Failed to create post for job ${job.id}:`, error);
        // Continue with other jobs even if one fails
      }
    }

    console.log(`🎉 Sync completed: ${createdCount}/${jobs.length} posts created`);
    return createdCount;
    
  } catch (error) {
    console.error("❌ Failed to sync completed jobs:", error);
    return 0;
  }
};