import { RedditPostDraft } from "../post-to-reddit";
import { emitProgress } from "./progress";

export const validateRedditPostDraft = (
  draft: RedditPostDraft
): {
  success: boolean;
  error?: string;
} => {
  emitProgress({
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
