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

// Reddit Session Types
export type RedditSessionData = {
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path?: string;
    expires?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  }>;
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  userAgent: string;
};

export type CreateSessionRequest = {
  sessionData: RedditSessionData;
  username?: string;
  userId?: string;
  expiresAt?: string;
};

export type SessionResponse = {
  id: string;
  userId: string | null;
  username: string | null;
  expiresAt: string;
  isValid: boolean;
  createdAt: string;
  updatedAt: string;
};
