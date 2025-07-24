import { RedditPostProgress } from "./progress";

export type SessionStorage = {
  getPath: () => string;
  exists: () => Promise<boolean>;
  read: () => Promise<string>;
  write: (data: string) => Promise<void>;
  clear: () => Promise<void>;
};

export type BrowserConfig = {
  headless?: boolean;
  userDataDir?: string;
  timeout?: number;
};

export type RetryConfig = {
  retries?: number;
  rateLimitDelay?: number;
};

export type RedditPosterConfig = {
  sessionStorage?: SessionStorage;
  onProgress?: (progress: RedditPostProgress) => void;
  browserOptions?: BrowserConfig;
  retryOptions?: RetryConfig;
};
