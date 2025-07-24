import {
  RedditPostDraft,
  RedditPoster,
  RedditPostProgress,
  RedditPostResult,
} from "@fanslib/reddit-automation";
import { sendNotification } from "../notifications/api";
import { createElectronSessionStorage } from "./electron-session-storage";

class ElectronRedditPoster {
  private static instance: ElectronRedditPoster;
  private poster: RedditPoster;

  private constructor() {
    const sessionStorage = createElectronSessionStorage();

    this.poster = new RedditPoster({
      sessionStorage,
      onProgress: this.handleProgress,
      browserOptions: {
        headless: false,
        timeout: 180000,
      },
      retryOptions: {
        retries: 3,
        rateLimitDelay: 60000,
      },
    });
  }

  public static getInstance(): ElectronRedditPoster {
    if (!ElectronRedditPoster.instance) {
      ElectronRedditPoster.instance = new ElectronRedditPoster();
    }
    return ElectronRedditPoster.instance;
  }

  private handleProgress = (progress: RedditPostProgress): void => {
    console.log(`[Reddit Automation] ${progress.stage}: ${progress.message}`);

    // Send user notification for important stages
    if (progress.stage === "completed" || progress.stage === "failed") {
      sendNotification({
        title: "Reddit Post",
        body: progress.message,
      });
    }
  };

  public async postToReddit(draft: RedditPostDraft): Promise<RedditPostResult> {
    return this.poster.postToReddit(draft);
  }

  public isCurrentlyRunning(): boolean {
    return this.poster.isCurrentlyRunning();
  }
}

// Export functions for backward compatibility
export const postToRedditWithPlaywright = async (
  draft: RedditPostDraft
): Promise<RedditPostResult> => {
  const poster = ElectronRedditPoster.getInstance();
  return poster.postToReddit(draft);
};

export const isRedditAutomationRunning = (): boolean => {
  const poster = ElectronRedditPoster.getInstance();
  return poster.isCurrentlyRunning();
};
