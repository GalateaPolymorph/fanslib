import type { GeneratedPost } from "../reddit-poster/api-type";
import type {
  ApiError,
  CreateQueueJobRequest,
  QueueJobResponse,
  QueueListResponse,
  SessionResponse,
} from "./types";

// Use Playwright's native format
export type PlaywrightSessionData = {
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
  origins?: Array<{
    origin: string;
    localStorage?: Array<{ name: string; value: string }>;
    sessionStorage?: Array<{ name: string; value: string }>;
  }>;
};

export type CreateSessionRequest = {
  sessionData: PlaywrightSessionData;
  username?: string;
  userId?: string;
  expiresAt?: string;
};

const baseUrl = "http://localhost:3000";

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.error || "API request failed");
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};

export const createQueueJob = async (jobData: CreateQueueJobRequest): Promise<QueueJobResponse> => {
  return request("/api/reddit/queue", {
    method: "POST",
    body: JSON.stringify(jobData),
  });
};

export const getQueueJobs = async (since?: string): Promise<QueueListResponse> => {
  const params = since ? `?since=${encodeURIComponent(since)}` : "";
  return request(`/api/reddit/queue${params}`);
};

export const getQueueJob = async (id: string): Promise<QueueJobResponse> => {
  return request(`/api/reddit/queue/${id}`);
};

export const deleteQueueJob = async (id: string): Promise<void> => {
  return request(`/api/reddit/queue/${id}`, {
    method: "DELETE",
  });
};

export const getQueueStatus = async (since?: string): Promise<QueueListResponse> => {
  const params = since ? `?since=${encodeURIComponent(since)}` : "";
  return request(`/api/reddit/queue/status${params}`);
};

export const healthCheck = async (): Promise<{ status: string; scheduler: string }> => {
  return request("/health");
};

export const isServerAvailable = async (): Promise<boolean> => {
  try {
    await healthCheck();
    return true;
  } catch {
    return false;
  }
};

export const checkServerAvailability = async (): Promise<boolean> => {
  try {
    const health = await healthCheck();
    // Check if both server and scheduler are running
    return health.status === "healthy" && health.scheduler === "running";
  } catch (error) {
    console.warn("Server availability check failed:", error);
    return false;
  }
};

export const schedulePostsToServer = async (
  posts: GeneratedPost[]
): Promise<QueueJobResponse[]> => {
  const results: QueueJobResponse[] = [];
  const errors: Array<{ postId: string; error: string }> = [];

  // Import serverQueueJobs for local cache updates
  const { addToServerJobsCache } = await import("./queue-sync");

  for (const post of posts) {
    try {
      let redgifsUrl = post.media.redgifsUrl;

      // If no RedGifs URL and this is a video, try fetching it via Postpone API
      if (!redgifsUrl && post.media.type === "video") {
        console.log(`⚠️ No RedGifs URL for media ${post.media.id}, attempting to fetch via Postpone API...`);
        
        try {
          const { findRedgifsURL } = await import("../api-postpone/operations");
          const response = await findRedgifsURL({ mediaId: post.media.id });
          
          if (response?.url) {
            redgifsUrl = response.url;
            
            // Save the URL to the media record for future use
            const { updateMedia } = await import("../library/operations");
            await updateMedia(post.media.id, { redgifsUrl });
            console.log(`✅ Fetched and saved RedGifs URL for media ${post.media.id}`);
          }
        } catch (fetchError) {
          console.warn(`Failed to fetch RedGifs URL for media ${post.media.id}:`, fetchError);
        }
      }

      // Final validation - we must have a URL to proceed
      if (!redgifsUrl) {
        throw new Error(`No RedGifs URL available for media ${post.media.id}. Unable to fetch from Postpone API.`);
      }

      const jobData: CreateQueueJobRequest = {
        subreddit: post.subreddit.name,
        caption: post.caption,
        url: redgifsUrl,
        mediaId: post.media.id,
        scheduledTime: post.date.toISOString(),
      };

      const result = await createQueueJob(jobData);
      
      // Add to local cache for immediate UI updates
      addToServerJobsCache(result);
      
      results.push(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      errors.push({ postId: post.id, error: errorMessage });
    }
  }

  // If there were any errors, throw an error with details
  if (errors.length > 0) {
    const errorDetails = errors.map((e) => `Post ${e.postId}: ${e.error}`).join("; ");
    throw new Error(
      `Failed to schedule ${errors.length} of ${posts.length} posts: ${errorDetails}`
    );
  }

  return results;
};

// Simplified Reddit Session API functions - no more conversion needed!
export const createSession = async (
  sessionData: CreateSessionRequest
): Promise<SessionResponse> => {
  const response = await request<{ success: boolean; session?: SessionResponse; error?: string }>(
    "/api/reddit/session",
    {
      method: "POST",
      body: JSON.stringify(sessionData),
    }
  );

  if (!response.success || !response.session) {
    throw new Error(response.error || "Failed to create session");
  }

  return response.session;
};

export const updateSession = async (
  sessionData: CreateSessionRequest
): Promise<SessionResponse> => {
  const response = await request<{ success: boolean; session?: SessionResponse; error?: string }>(
    "/api/reddit/session",
    {
      method: "PUT",
      body: JSON.stringify(sessionData),
    }
  );

  if (!response.success || !response.session) {
    throw new Error(response.error || "Failed to update session");
  }

  return response.session;
};

export const getSession = async (userId?: string): Promise<SessionResponse | null> => {
  try {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const response = await request<{ success: boolean; session?: SessionResponse; error?: string }>(
      `/api/reddit/session${params}`
    );

    if (!response.success) {
      return null;
    }

    return response.session || null;
  } catch {
    return null;
  }
};

export const getSessionData = async (userId?: string): Promise<PlaywrightSessionData | null> => {
  try {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const response = await request<{
      success: boolean;
      sessionData?: PlaywrightSessionData;
      error?: string;
    }>(`/api/reddit/session/data${params}`);

    if (!response.success) {
      return null;
    }

    return response.sessionData || null;
  } catch {
    return null;
  }
};

export const getSessionStatus = async (userId?: string): Promise<boolean> => {
  try {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const response = await request<{ success: boolean; isValid?: boolean; error?: string }>(
      `/api/reddit/session/status${params}`
    );

    return response.success && response.isValid === true;
  } catch {
    return false;
  }
};

export const deleteSession = async (userId?: string): Promise<boolean> => {
  try {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const response = await request<{ success: boolean; error?: string }>(
      `/api/reddit/session${params}`,
      {
        method: "DELETE",
      }
    );

    return response.success;
  } catch {
    return false;
  }
};
