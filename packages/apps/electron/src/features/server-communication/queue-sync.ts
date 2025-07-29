import { createQueueJob, getQueueStatus, deleteQueueJob, isServerAvailable } from "./api-client";
import type { QueueJobResponse } from "./types";

// Module-level state - cache of server jobs for UI display
const serverQueueJobs = new Map<string, QueueJobResponse>();
let lastSyncTime: string | null = null;

export const syncStatusFromServer = async (): Promise<void> => {
  try {
    const serverAvailable = await isServerAvailable();
    if (!serverAvailable) {
      return;
    }

    const response = await getQueueStatus(lastSyncTime || undefined);

    // Update our local cache of server jobs for UI display
    for (const job of response.jobs) {
      serverQueueJobs.set(job.id, job);
    }

    lastSyncTime = response.lastUpdated;
  } catch (error) {
    console.error("❌ Failed to sync status from server:", error);
  }
};

export const getServerJobs = (): QueueJobResponse[] => {
  return Array.from(serverQueueJobs.values());
};

export const getServerJobById = (jobId: string): QueueJobResponse | null => {
  return serverQueueJobs.get(jobId) || null;
};

export const removeServerJob = async (jobId: string): Promise<void> => {
  try {
    await deleteQueueJob(jobId);
    serverQueueJobs.delete(jobId);
    console.log(`✅ Removed server job ${jobId}`);
  } catch (error) {
    console.error(`❌ Failed to remove server job ${jobId}:`, error);
  }
};

export const createServerJob = async (jobData: {
  subreddit: string;
  caption: string;
  url?: string;
  flair?: string;
  mediaId?: string;
  scheduledTime: string;
}): Promise<QueueJobResponse | null> => {
  try {
    const serverAvailable = await isServerAvailable();
    if (!serverAvailable) {
      console.warn("⚠️ Server unavailable, cannot create Reddit job");
      return null;
    }

    const queueJob = await createQueueJob(jobData);

    // Store in local cache for immediate UI updates
    serverQueueJobs.set(queueJob.id, queueJob);

    console.log(`✅ Created Reddit job ${queueJob.id} on server queue`);
    return queueJob;
  } catch (error) {
    console.error(`❌ Failed to create server job:`, error);
    return null;
  }
};