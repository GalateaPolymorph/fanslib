import { Media } from "src/features/library/entity";
import { Subreddit } from "../../../../features/channels/subreddit";

export type SubredditPostDraft = {
  subreddit: Subreddit;
  media?: Media;
  url?: string;
  caption?: string;
  postId?: string;
};
