import { LessThanOrEqual } from "typeorm";
import { getDatabase } from "../database/config";
import {
  RedditQueueJob,
  RedditQueueJobStatus,
  RedditQueueLog,
  RedditQueueLogEventType,
} from "../database/entities";
import type {
  CreateQueueJobRequest,
  QueueJobResponse,
  QueueListResponse,
  QueueStatus,
} from "../types";

const generateId = () => crypto.randomUUID();

const getCurrentTimestamp = () => new Date().toISOString();

export const createJob = async (jobData: CreateQueueJobRequest): Promise<QueueJobResponse> => {
  const db = await getDatabase();
  const jobRepository = db.getRepository(RedditQueueJob);

  const id = generateId();

  const job = jobRepository.create({
    id,
    subreddit: jobData.subreddit,
    caption: jobData.caption,
    url: jobData.url || undefined,
    flair: jobData.flair || undefined,
    mediaId: jobData.mediaId || undefined,
    scheduledTime: jobData.scheduledTime,
    status: "queued" as RedditQueueJobStatus,
    postUrl: undefined,
    errorMessage: undefined,
  });

  await jobRepository.save(job);
  await addLog(id, "queued", "Job added to queue");

  return {
    id: job.id,
    subreddit: job.subreddit,
    caption: job.caption,
    url: job.url || null,
    flair: job.flair || null,
    mediaId: job.mediaId || null,
    scheduledTime: job.scheduledTime,
    status: job.status as QueueStatus,
    postUrl: job.postUrl || null,
    errorMessage: job.errorMessage || null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
};

export const getJobs = async (_since?: string): Promise<QueueListResponse> => {
  const db = await getDatabase();
  const jobRepository = db.getRepository(RedditQueueJob);

  const jobs = await jobRepository.find({
    order: { scheduledTime: "DESC" },
  });

  return {
    jobs: jobs.map((job) => ({
      id: job.id,
      subreddit: job.subreddit,
      caption: job.caption,
      url: job.url || null,
      flair: job.flair || null,
      mediaId: job.mediaId || null,
      scheduledTime: job.scheduledTime,
      status: job.status as QueueStatus,
      postUrl: job.postUrl || null,
      errorMessage: job.errorMessage || null,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    })),
    lastUpdated: getCurrentTimestamp(),
  };
};

export const getJobById = async (id: string): Promise<QueueJobResponse | null> => {
  const db = await getDatabase();
  const jobRepository = db.getRepository(RedditQueueJob);

  const job = await jobRepository.findOne({ where: { id } });

  if (!job) return null;

  return {
    id: job.id,
    subreddit: job.subreddit,
    caption: job.caption,
    url: job.url || null,
    flair: job.flair || null,
    mediaId: job.mediaId || null,
    scheduledTime: job.scheduledTime,
    status: job.status as QueueStatus,
    postUrl: job.postUrl || null,
    errorMessage: job.errorMessage || null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
};

export const getJobsDue = async (): Promise<QueueJobResponse[]> => {
  const db = await getDatabase();
  const jobRepository = db.getRepository(RedditQueueJob);
  const now = getCurrentTimestamp();

  const jobs = await jobRepository.find({
    where: {
      status: "queued",
      scheduledTime: LessThanOrEqual(now),
    },
    order: { scheduledTime: "ASC" },
  });

  return jobs.map((job) => ({
    id: job.id,
    subreddit: job.subreddit,
    caption: job.caption,
    url: job.url || null,
    flair: job.flair || null,
    mediaId: job.mediaId || null,
    scheduledTime: job.scheduledTime,
    status: job.status as QueueStatus,
    postUrl: job.postUrl || null,
    errorMessage: job.errorMessage || null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }));
};

export const updateJobStatus = async (
  id: string,
  status: QueueStatus,
  updates: Partial<{ postUrl: string; errorMessage: string }> = {}
): Promise<void> => {
  const db = await getDatabase();
  const jobRepository = db.getRepository(RedditQueueJob);

  await jobRepository.update(id, {
    status: status as RedditQueueJobStatus,
    ...updates,
  });

  const message =
    status === "posted"
      ? `Job completed successfully${updates.postUrl ? ` - ${updates.postUrl}` : ""}`
      : status === "failed"
        ? `Job failed${updates.errorMessage ? ` - ${updates.errorMessage}` : ""}`
        : status === "processing"
          ? "Job started processing"
          : "Job status updated";

  await addLog(id, status as RedditQueueLogEventType, message);
};

export const deleteJob = async (id: string): Promise<boolean> => {
  const db = await getDatabase();
  const jobRepository = db.getRepository(RedditQueueJob);

  const result = await jobRepository.delete(id);
  return result.affected ? result.affected > 0 : false;
};

export const addLog = async (
  jobId: string,
  eventType: RedditQueueLogEventType,
  message: string
): Promise<void> => {
  const db = await getDatabase();
  const logRepository = db.getRepository(RedditQueueLog);

  const log = logRepository.create({
    jobId,
    eventType,
    message,
    timestamp: getCurrentTimestamp(),
  });

  await logRepository.save(log);
};

export const getJobLogs = async (jobId: string) => {
  const db = await getDatabase();
  const logRepository = db.getRepository(RedditQueueLog);

  return await logRepository.find({
    where: { jobId },
    order: { timestamp: "DESC" },
  });
};
