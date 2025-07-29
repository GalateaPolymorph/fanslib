import { RedditPoster } from "@fanslib/reddit-automation";
import type { SessionStorage } from "@fanslib/reddit-automation";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import type { QueueJobResponse } from "../types";
import { addLog, getJobsDue, updateJobStatus } from "./queue-service";
import { getSessionData } from "./session-service";
import type { RedditSessionData } from "./session-service";

// Database-backed SessionStorage implementation
const createDatabaseSessionStorage = (userId?: string): SessionStorage => {
  const tempDir = path.join(os.tmpdir(), "fanslib-server-sessions");
  const sessionPath = path.join(tempDir, `reddit-session-${userId || "default"}.json`);

  return {
    getPath: () => sessionPath,

    exists: async (): Promise<boolean> => {
      try {
        await fs.access(sessionPath);
        return true;
      } catch {
        return false;
      }
    },

    read: async (): Promise<string> => {
      try {
        return await fs.readFile(sessionPath, "utf-8");
      } catch (error) {
        throw new Error(`Failed to read session file: ${error}`);
      }
    },

    write: async (data: string): Promise<void> => {
      try {
        await fs.mkdir(tempDir, { recursive: true });
        await fs.writeFile(sessionPath, data, "utf-8");
      } catch (error) {
        throw new Error(`Failed to write session file: ${error}`);
      }
    },

    clear: async (): Promise<void> => {
      try {
        await fs.unlink(sessionPath);
      } catch (error) {
        // File might not exist, which is fine
        console.warn(`Could not clear session file: ${error}`);
      }
    },
  };
};

// Convert database session data to Playwright storage state format
const convertToPlaywrightStorageState = (sessionData: RedditSessionData) => {
  return {
    cookies: sessionData.cookies,
    origins: [
      {
        origin: "https://www.reddit.com",
        localStorage: Object.entries(sessionData.localStorage).map(([name, value]) => ({
          name,
          value,
        })),
      },
    ],
  };
};

// Initialize session from database for the SessionStorage
const initializeSessionFromDatabase = async (
  sessionStorage: SessionStorage,
  userId?: string
): Promise<boolean> => {
  try {
    const sessionData = await getSessionData(userId);
    if (!sessionData) {
      console.log("No valid session found in database");
      return false;
    }

    const playwrightStorageState = convertToPlaywrightStorageState(sessionData);
    const sessionJson = JSON.stringify(playwrightStorageState, null, 2);

    await sessionStorage.write(sessionJson);
    console.log("✅ Session loaded from database to temporary file");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize session from database:", error);
    return false;
  }
};

const getRedditPoster = async (jobId: string, userId?: string): Promise<RedditPoster> => {
  const sessionStorage = createDatabaseSessionStorage(userId);

  // Try to load session from database
  await initializeSessionFromDatabase(sessionStorage, userId);

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
  });
};

export const processJob = async (job: QueueJobResponse): Promise<void> => {
  console.log(`🚀 Processing Reddit queue job ${job.id} for r/${job.subreddit}`);

  try {
    // Update job status to processing
    await updateJobStatus(job.id, "processing");

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

      await updateJobStatus(job.id, "posted", {
        postUrl: result.url,
      });
    } else {
      console.log(`❌ Failed to post job ${job.id}:`, result.error);

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

    await updateJobStatus(job.id, "failed", {
      errorMessage,
    });
  }
};

export const processAllDueJobs = async (): Promise<void> => {
  const jobs = await getJobsDue();

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
