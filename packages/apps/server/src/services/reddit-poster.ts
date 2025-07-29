import { RedditPoster } from "@fanslib/reddit-automation";
import type { QueueJobResponse } from "../types";
import { addLog, getJobsDue, updateJobStatus } from "./queue-service";

const getRedditPoster = (jobId: string): RedditPoster => {
  return new RedditPoster({
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

    const poster = getRedditPoster(job.id);

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

      await updateJobStatus(job.id, "failed", {
        errorMessage: result.error || "Unknown error occurred",
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
