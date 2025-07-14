import type { Browser, BrowserContext, Page } from "playwright";

// Main automation context
export type FanslyAutomationContext = {
  browser: Browser;
  browserContext: BrowserContext;
  page: Page;
  userDataDir: string;
};

// Options for starting automation
export type FanslyAutomationOptions = {
  headless?: boolean;
  timeout?: number;
  userDataDir?: string;
  debug?: boolean;
};

// Progress tracking types
export type FanslyAutomationProgress = {
  stage:
    | "validating"
    | "launching_browser"
    | "navigating"
    | "logging_in"
    | "extracting_credentials"
    | "discovering_posts"
    | "extracting_statistics"
    | "completed"
    | "failed";
  message: string;
  progress?: number; // 0-100 percentage
};

// Credential extraction result
export type FanslyCredentials = {
  authorization: string;
  fanslySessionId: string;
  fanslyClientCheck: string;
  fanslyClientId: string;
};

// Post discovery result
export type FanslyPostData = {
  postId: string;
  postUrl: string;
  statisticsId: string;
  statisticsUrl: string;
  title?: string;
  thumbnailUrl?: string;
  publishedAt?: Date;
};

// Main automation result
export type FanslyAutomationResult = {
  success: boolean;
  credentials?: FanslyCredentials;
  posts?: FanslyPostData[];
  error?: string;
  fallbackToManual?: boolean;
};

// Options for post discovery
export type PostDiscoveryOptions = {
  maxPosts?: number;
  daysBack?: number;
  includeScheduled?: boolean;
};
