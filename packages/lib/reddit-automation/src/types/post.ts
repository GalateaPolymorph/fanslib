export type RedditPostDraft = {
  subreddit: string;
  caption: string;
  type: "Link";
  url: string;
  flair?: string;
};

export type RedditPostResult = {
  success: boolean;
  url?: string;
  error?: string;
};
