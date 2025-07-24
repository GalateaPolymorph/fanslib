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
