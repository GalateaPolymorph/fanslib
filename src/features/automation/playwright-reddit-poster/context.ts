import { Browser, BrowserContext, Page } from "playwright";

export type PlaywrightRedditPosterOptions = {
  timeout?: number;
  headless?: boolean;
  userDataDir?: string;
  retries?: number;
  rateLimitDelay?: number;
};

export type RedditPostProgress = {
  stage:
    | "validating"
    | "launching_browser"
    | "navigating"
    | "logging_in"
    | "posting"
    | "completed"
    | "failed";
  message: string;
};

export type RedditPostingContext = {
  browser: Browser | null;
  page: Page;
  browserContext: BrowserContext | null;
};
