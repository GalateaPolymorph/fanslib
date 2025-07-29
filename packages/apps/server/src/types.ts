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

// Reddit Session Types
export const RedditSessionDataSchema = z.object({
  cookies: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      domain: z.string(),
      path: z.string().optional(),
      expires: z.number().optional(),
      httpOnly: z.boolean().optional(),
      secure: z.boolean().optional(),
      sameSite: z.enum(["Strict", "Lax", "None"]).optional(),
    })
  ),
  localStorage: z.record(z.string()),
  sessionStorage: z.record(z.string()),
  userAgent: z.string(),
});

export type RedditSessionDataRequest = z.infer<typeof RedditSessionDataSchema>;

export const CreateSessionSchema = z.object({
  sessionData: RedditSessionDataSchema,
  username: z.string().optional(),
  userId: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

export type CreateSessionRequest = z.infer<typeof CreateSessionSchema>;

export const SessionResponseSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  username: z.string().nullable(),
  expiresAt: z.string(),
  isValid: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;
