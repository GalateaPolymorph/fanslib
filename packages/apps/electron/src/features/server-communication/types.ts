export type QueueStatus = "queued" | "processing" | "posted" | "failed";

export type QueueJobResponse = {
  id: string;
  subreddit: string;
  caption: string;
  url: string | null;
  flair: string | null;
  mediaId: string | null;
  scheduledTime: string;
  status: QueueStatus;
  postUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateQueueJobRequest = {
  subreddit: string;
  caption: string;
  url?: string;
  flair?: string;
  mediaId?: string;
  scheduledTime: string;
};

export type QueueListResponse = {
  jobs: QueueJobResponse[];
  lastUpdated: string;
};

export type ApiError = {
  error: string;
  details?: string;
};
