import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Media } from "../library/entity";
import { Subreddit } from "../channels/subreddit";


export type GeneratedPost = {
  subreddit: Subreddit;
  media: Media;
  caption: string;
  redgifsUrl: string | null;
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
  media: Media;
  caption: string;
  scheduledDate: string;
  createdAt: string;
};

export type RegenerateMediaResult = {
  media: Media;
  caption: string;
  redgifsUrl: string | null;
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
  scheduleAllPosts: (
    _: any,
    posts: PostToSchedule[],
    channelId: string
  ) => Promise<string[]>;
  getScheduledPosts: (
    _: any,
    channelId: string
  ) => Promise<ScheduledPost[]>;
};

export const namespace = "reddit-poster" as const;
export const redditPosterMethods = methods.map((m) => prefixNamespace(namespace, m));
export type RedditPosterIpcChannel = keyof PrefixNamespace<RedditPosterHandlers, typeof namespace>;
export type RedditPosterIpcHandlers = {
  [K in RedditPosterIpcChannel]: RedditPosterHandlers[StripNamespace<K, typeof namespace>];
};