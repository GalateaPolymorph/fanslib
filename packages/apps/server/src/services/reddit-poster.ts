import type { SessionStorage } from "@fanslib/reddit-automation";
import { RedditPoster } from "@fanslib/reddit-automation";
import type { QueueJobResponse } from "../types";
import { addLog, getAndLockJobsDue, updateJobStatus } from "./queue-service";
import { getSessionData } from "./session-service";

// Direct database SessionStorage implementation (no files!)
const createDatabaseSessionStorage = (userId?: string): SessionStorage => {
  return {
    getPath: () => `database://reddit-session-${userId || "default"}`,

    exists: async (): Promise<boolean> => {
      try {
        const sessionData = await getSessionData(userId);
        return sessionData !== null;
      } catch {
        return false;
      }
    },

    read: async (): Promise<string> => {
      try {
        const sessionData = await getSessionData(userId);
        if (!sessionData) {
          throw new Error("No session data found in database");
        }
        return JSON.stringify(sessionData);
      } catch (error) {
        throw new Error(`Failed to read session from database: ${error}`);
      }
    },

    write: async (_data: string): Promise<void> => {
      // Writing not needed for server-only approach
      // Session data is managed through the session API endpoints
      console.warn("⚠️ Direct session write attempted - sessions should be managed via API");
    },

    clear: async (): Promise<void> => {
      // Clearing not needed for server-only approach
      // Session deletion is managed through the session API endpoints
      console.warn("⚠️ Direct session clear attempted - sessions should be managed via API");
    },
  };
};

const getRedditPoster = async (jobId: string, userId?: string): Promise<RedditPoster> => {
  const sessionStorage = createDatabaseSessionStorage(userId);

  return new RedditPoster({
    sessionStorage,
    onProgress: async (progress) => {
      console.log(`📈 Job ${jobId} progress: ${progress.stage} - ${progress.message}`);

      // Add detailed progress to job logs for tracking and potential UI updates
      await addLog(jobId, "progress", `${progress.stage}: ${progress.message}`);

      // Update job status for major milestones to provide better tracking
      // This doesn't change the overall job status but provides sub-status information
      if (progress.stage === "launching_browser") {
        await addLog(jobId, "milestone", "Browser launched, preparing for Reddit submission");
      } else if (progress.stage === "logging_in") {
        await addLog(jobId, "milestone", "Authenticating with Reddit");
      } else if (progress.stage === "posting") {
        await addLog(jobId, "milestone", "Submitting post to Reddit");
      } else if (progress.stage === "completed") {
        await addLog(jobId, "milestone", "Reddit submission completed successfully");
      } else if (progress.stage === "failed") {
        await addLog(jobId, "milestone", `Reddit submission failed: ${progress.message}`);
      }
    },
    browserOptions: {
      headless: true,
    },
  });
};

export const processJob = async (job: QueueJobResponse): Promise<void> => {
  console.log(`🚀 Processing Reddit queue job ${job.id} for r/${job.subreddit}`);
  await addLog(job.id, "processing", `Started processing job for r/${job.subreddit}`);

  try {
    // Skip if job doesn't have a URL (required for Reddit Link posts)
    if (!job.url) {
      console.log(`⚠️ Skipping job ${job.id} - no URL provided for Reddit Link post`);
      await updateJobStatus(job.id, "failed", {
        errorMessage: "URL is required for Reddit Link posts",
      });
      return;
    }

    const poster = await getRedditPoster(job.id);

    // Prepare post data for Reddit API
    const postData = {
      subreddit: job.subreddit,
      caption: job.caption,
      type: "Link" as const,
      url: job.url,
      flair: job.flair || undefined,
    };

    // Execute the Reddit post
    const result = await poster.postToReddit(postData);

    if (result.success) {
      console.log(`✅ Successfully posted job ${job.id} to Reddit: ${result.url}`);
      await addLog(job.id, "posted", `Successfully posted to Reddit: ${result.url}`);

      await updateJobStatus(job.id, "posted", {
        postUrl: result.url,
      });
    } else {
      console.log(`❌ Failed to post job ${job.id}:`, result.error);
      await addLog(job.id, "failed", `Reddit posting failed: ${result.error}`);

      // Check if error is session-related
      const errorMessage = result.error || "Unknown error occurred";
      const isSessionError =
        errorMessage.toLowerCase().includes("session") ||
        errorMessage.toLowerCase().includes("login") ||
        errorMessage.toLowerCase().includes("authentication");

      await updateJobStatus(job.id, "failed", {
        errorMessage: isSessionError ? "session_expired" : errorMessage,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.log(`💥 Exception processing job ${job.id}:`, errorMessage);
    await addLog(job.id, "failed", `Critical error during processing: ${errorMessage}`);

    await updateJobStatus(job.id, "failed", {
      errorMessage,
    });
  }
};

export const processAllDueJobs = async (): Promise<void> => {
  const jobs = await getAndLockJobsDue();

  if (jobs.length === 0) {
    return;
  }

  console.log(`⏰ Found ${jobs.length} due Reddit jobs to process`);

  for (const job of jobs) {
    try {
      await processJob(job);

      if (jobs.indexOf(job) < jobs.length - 1) {
        console.log("⏳ Waiting 10 seconds before next post...");
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    } catch (error) {
      console.error(`🔥 Critical error processing job ${job.id}:`, error);
    }
  }
};
