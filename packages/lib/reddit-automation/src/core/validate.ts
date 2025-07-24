import { RedditPostDraft } from "../types/post";
import { RedditPostProgress } from "../types/progress";

export const validateRedditPostDraft = (
  draft: RedditPostDraft,
  onProgress?: (progress: RedditPostProgress) => void
): {
  success: boolean;
  error?: string;
} => {
  onProgress?.({
    stage: "validating",
    message: "Validating post data...",
  });

  if (!draft.subreddit || !draft.caption || !draft.url) {
    return {
      success: false,
      error: "Missing required fields: subreddit, caption, and url",
    };
  }

  console.log(`Starting Reddit post to r/${draft.subreddit}...`);
  console.log(`Title: ${draft.caption}`);
  console.log(`URL: ${draft.url}`);
  console.log(`Type: ${draft.type}`);
  return {
    success: true,
  };
};
