import { Subreddit } from "../../../../../features/channels/subreddit";
import { Media } from "../../../../../features/library/entity";

export type GenerationError = {
  type: "subreddit" | "media" | "redgifs" | "caption" | "general";
  message: string;
  retryable: boolean;
};

export type PostState = {
  subreddit: Subreddit | null;
  media: Media | null;
  caption: string;
  isLoading: boolean;
  error: GenerationError | null;
  isUrlReady: boolean;
  totalMediaAvailable: number;
  hasPostedToReddit: boolean;
};
