import { handleRateLimiting } from "./core/bot-detection";
import { closeBrowserIfOpened, initializeBrowser } from "./core/browser";
import { handleLogin } from "./core/login";
import { navigateToSubreddit } from "./core/navigation";
import { submitPost } from "./core/submit";
import { validateRedditPostDraft } from "./core/validate";
import { RedditPosterConfig } from "./types/config";
import { RedditPostingContext } from "./types/context";
import { RedditPostDraft, RedditPostResult } from "./types/post";

export class RedditPoster {
  private context: RedditPostingContext | null = null;
  private isCurrentlyPosting = false;
  private config: RedditPosterConfig;

  constructor(config: RedditPosterConfig = {}) {
    this.config = config;
  }

  public isCurrentlyRunning(): boolean {
    return this.isCurrentlyPosting;
  }

  public async postToReddit(draft: RedditPostDraft): Promise<RedditPostResult> {
    if (this.isCurrentlyPosting) {
      return {
        success: false,
        error: "Reddit posting is already in progress",
      };
    }

    this.isCurrentlyPosting = true;
    try {
      const validationResult = validateRedditPostDraft(draft, this.config.onProgress);
      if (!validationResult.success) {
        throw new Error(validationResult.error);
      }

      this.config.onProgress?.({
        stage: "launching_browser",
        message: "Launching browser...",
      });

      await closeBrowserIfOpened(this.context);
      this.context = await initializeBrowser(
        this.config.sessionStorage,
        this.config.browserOptions
      );

      if (!this.context) {
        throw new Error("Failed to initialize browser context");
      }

      await navigateToSubreddit(this.context.page, draft.subreddit, this.config.onProgress);
      await handleRateLimiting(this.context.page);
      await handleLogin(this.context, this.config.sessionStorage, this.config.onProgress);

      const postUrl = await submitPost(this.context.page, draft, this.config.onProgress);

      this.config.onProgress?.({
        stage: "completed",
        message: postUrl
          ? `Successfully posted to r/${draft.subreddit}`
          : `Post completed (URL not detected)`,
      });

      return {
        success: true,
        url: postUrl ?? undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      this.config.onProgress?.({
        stage: "failed",
        message: `Failed to post to r/${draft.subreddit}: ${errorMessage}`,
      });

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      await closeBrowserIfOpened(this.context);
      this.isCurrentlyPosting = false;
    }
  }
}
