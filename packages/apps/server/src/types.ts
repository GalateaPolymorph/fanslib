import { z } from "zod";

export const QueueStatus = z.enum(["queued", "processing", "posted", "failed"]);
export type QueueStatus = z.infer<typeof QueueStatus>;

export const CreateQueueJobSchema = z.object({
  subreddit: z.string().min(1),
  caption: z.string().min(1),
  url: z.string().url().optional(),
  flair: z.string().optional(),
  mediaId: z.string().optional(),
  scheduledTime: z.string().datetime(),
});

export type CreateQueueJobRequest = z.infer<typeof CreateQueueJobSchema>;

export const QueueJobResponseSchema = z.object({
  id: z.string(),
  subreddit: z.string(),
  caption: z.string(),
  url: z.string().nullable(),
  flair: z.string().nullable(),
  mediaId: z.string().nullable(),
  scheduledTime: z.string(),
  status: QueueStatus,
  postUrl: z.string().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type QueueJobResponse = z.infer<typeof QueueJobResponseSchema>;

export const QueueListResponseSchema = z.object({
  jobs: z.array(QueueJobResponseSchema),
  lastUpdated: z.string(),
});

export type QueueListResponse = z.infer<typeof QueueListResponseSchema>;
