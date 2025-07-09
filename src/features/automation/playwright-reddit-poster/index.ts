import { RedditPostResult } from "../api-type";
import { RedditPostDraft } from "../post-to-reddit";
import { closeBrowserIfOpened, initializeBrowser } from "./browser";
import { PlaywrightRedditPosterOptions, RedditPostingContext } from "./context";
import { handleLogin } from "./login";
import { navigateToSubreddit } from "./navigation";
import { emitProgress } from "./progress";
import { submitPost } from "./submit";
import { validateRedditPostDraft } from "./validate";

class PlaywrightRedditPoster {
  private static instance: PlaywrightRedditPoster;
  private context: RedditPostingContext | null = null;
  private isCurrentlyPosting = false;

  public static getInstance(): PlaywrightRedditPoster {
    if (!PlaywrightRedditPoster.instance) {
      PlaywrightRedditPoster.instance = new PlaywrightRedditPoster();
    }
    return PlaywrightRedditPoster.instance;
  }

  public isCurrentlyRunning(): boolean {
    return this.isCurrentlyPosting;
  }

  public async postToReddit(
    draft: RedditPostDraft,
    options: PlaywrightRedditPosterOptions = {}
  ): Promise<RedditPostResult> {
    if (this.isCurrentlyPosting) {
      return {
        success: false,
        error: "Reddit posting is already in progress",
      };
    }

    this.isCurrentlyPosting = true;
    try {
      const validationResult = validateRedditPostDraft(draft);
      if (!validationResult.success) {
        throw new Error(validationResult.error);
      }

      emitProgress({
        stage: "launching_browser",
        message: "Launching browser...",
      });

      await closeBrowserIfOpened(this.context);
      this.context = await initializeBrowser(options);
      if (!this.context) {
        throw new Error("Failed to initialize browser context");
      }

      await navigateToSubreddit(this.context.page, draft.subreddit);
      await handleLogin(this.context);

      const postUrl = await submitPost(this.context.page, draft);

      emitProgress({
        stage: "completed",
        message: postUrl
          ? `Successfully posted to r/${draft.subreddit}`
          : `Post completed (URL not detected)`,
      });

      return {
        success: true,
        url: postUrl,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      emitProgress({
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

export const postToRedditWithPlaywright = async (
  draft: RedditPostDraft,
  options: PlaywrightRedditPosterOptions = {}
): Promise<RedditPostResult> => {
  const poster = PlaywrightRedditPoster.getInstance();
  return poster.postToReddit(draft, options);
};

export const isRedditAutomationRunning = (): boolean => {
  const poster = PlaywrightRedditPoster.getInstance();
  return poster.isCurrentlyRunning();
};
