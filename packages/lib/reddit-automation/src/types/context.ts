import { Browser, BrowserContext, Page } from "playwright";

export type RedditPostingContext = {
  browser: Browser | null;
  page: Page;
  browserContext: BrowserContext | null;
};
