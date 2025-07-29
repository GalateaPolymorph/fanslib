import type { QueueJobResponse, CreateQueueJobRequest, QueueListResponse, ApiError } from "./types";

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
