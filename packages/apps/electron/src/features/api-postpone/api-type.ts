import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import type { SubredditPostingTime } from "../channels/api-type";

export type PostponeBlueskyDraftPayload = {
  postId: string;
};

export type PostponeBlueskyDraftResponse = {
  success: boolean;
};

export type FindRedgifsURLPayload = {
  mediaId: string;
};

export type FindRedgifsURLResponse = {
  url: string | null;
};

export type RefreshRedgifsURLPayload = {
  mediaId: string;
};

export type RefreshRedgifsURLResponse = {
  url: string | null;
};

export type FindSubredditPostingTimesPayload = {
  subreddit: string;
  timezone?: string;
};

export type FindSubredditPostingTimesResponse = {
  postingTimes: SubredditPostingTime[];
  subreddit: string;
  timezone: string;
};

const methods = [
  "draftBlueskyPost",
  "findRedgifsURL",
  "refreshRedgifsURL",
  "findSubredditPostingTimes",
] as const;

export type APIPostponeHandlers = {
  draftBlueskyPost: (
    _: any,
    data: PostponeBlueskyDraftPayload
  ) => Promise<PostponeBlueskyDraftResponse>;
  findRedgifsURL: (_: any, data: FindRedgifsURLPayload) => Promise<FindRedgifsURLResponse>;
  refreshRedgifsURL: (_: any, data: RefreshRedgifsURLPayload) => Promise<RefreshRedgifsURLResponse>;
  findSubredditPostingTimes: (
    _: any,
    data: FindSubredditPostingTimesPayload
  ) => Promise<FindSubredditPostingTimesResponse>;
};

export const namespace = "api-postpone" as const;
export const apiPostponeMethods = methods.map((m) => prefixNamespace(namespace, m));
export type APIPostponeIpcChannel = keyof PrefixNamespace<APIPostponeHandlers, typeof namespace>;
export type APIPostponeIpcHandlers = {
  [K in APIPostponeIpcChannel]: APIPostponeHandlers[StripNamespace<K, typeof namespace>];
};
