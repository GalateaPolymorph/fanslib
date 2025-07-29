import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Subreddit } from "../channels/subreddit";
import { Media } from "../library/entity";

export type GeneratedPost = {
  subreddit: Subreddit;
  media: Media;
  caption: string;
  date: Date;
};

export type PostToSchedule = {
  subredditId: string;
  mediaId: string;
  caption: string;
  date: Date;
};

export type ScheduledPost = {
  id: string;
  subreddit: Subreddit;
  media: Media; // Always populated, fetched on-demand for server jobs
  caption: string;
  scheduledDate: string;
  createdAt: string;
  serverJobId?: string; // ID of the server queue job if applicable
  status?: string; // Queue status if applicable
};

export type RegenerateMediaResult = {
  media: Media;
  caption: string;
};

export const methods = [
  "generateRandomPost",
  "generatePosts",
  "regenerateMedia",
  "scheduleAllPosts",
  "getScheduledPosts",
] as const;

export type RedditPosterHandlers = {
  generateRandomPost: (
    _: any,
    subreddits: Subreddit[],
    channelId: string
  ) => Promise<GeneratedPost>;
  generatePosts: (
    _: any,
    count: number,
    subreddits: Subreddit[],
    channelId: string
  ) => Promise<GeneratedPost[]>;
  regenerateMedia: (
    _: any,
    subredditId: string,
    channelId: string
  ) => Promise<RegenerateMediaResult>;
  scheduleAllPosts: (_: any, posts: PostToSchedule[], channelId: string) => Promise<string[]>;
  getScheduledPosts: (_: any, channelId: string) => Promise<ScheduledPost[]>;
};

export const namespace = "reddit-poster" as const;
export const redditPosterMethods = methods.map((m) => prefixNamespace(namespace, m));
export type RedditPosterIpcChannel = keyof PrefixNamespace<RedditPosterHandlers, typeof namespace>;
export type RedditPosterIpcHandlers = {
  [K in RedditPosterIpcChannel]: RedditPosterHandlers[StripNamespace<K, typeof namespace>];
};
