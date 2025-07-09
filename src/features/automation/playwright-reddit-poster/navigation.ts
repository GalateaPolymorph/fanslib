import { Page } from "playwright";
import { emitProgress } from "./progress";

export const waitForAppLoad = async (page: Page): Promise<void> => {
  await page.waitForSelector("shreddit-app", { timeout: 30000, state: "attached" });
};

export const navigateToSubreddit = async (page: Page, subreddit: string): Promise<void> => {
  emitProgress({
    stage: "navigating",
    message: `Navigating to r/${subreddit}...`,
  });

  const url = `https://www.reddit.com/r/${subreddit}/submit`;

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await waitForAppLoad(page);
};
