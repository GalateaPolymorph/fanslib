import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Subreddit } from "../channels/subreddit";
import { Media } from "../library/entity";

export type GeneratedPost = {
  id: string;
  subreddit: Subreddit;
  media: Media;
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
  serverJobId?: string;
  status?: "queued" | "processing" | "posted" | "failed";
  errorMessage?: string;
  postUrl?: string;
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
  "loginToReddit",
  "checkLoginStatus",
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
  scheduleAllPosts: (_: any, posts: GeneratedPost[]) => Promise<string[]>;
  getScheduledPosts: (_: any) => Promise<ScheduledPost[]>;
  loginToReddit: (_: any, userId?: string) => Promise<boolean>;
  checkLoginStatus: (
    _: any,
    userId?: string
  ) => Promise<{ isLoggedIn: boolean; username?: string }>;
};

export const namespace = "reddit-poster" as const;
export const redditPosterMethods = methods.map((m) => prefixNamespace(namespace, m));
export type RedditPosterIpcChannel = keyof PrefixNamespace<RedditPosterHandlers, typeof namespace>;
export type RedditPosterIpcHandlers = {
  [K in RedditPosterIpcChannel]: RedditPosterHandlers[StripNamespace<K, typeof namespace>];
};
