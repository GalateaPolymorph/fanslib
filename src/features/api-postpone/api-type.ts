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
  url: string;
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

const methods = ["draftBlueskyPost", "findRedgifsURL", "findSubredditPostingTimes"] as const;

export type APIPostponeHandlers = {
  draftBlueskyPost: (
    _: any,
    data: PostponeBlueskyDraftPayload
  ) => Promise<PostponeBlueskyDraftResponse>;
  findRedgifsURL: (_: any, data: FindRedgifsURLPayload) => Promise<FindRedgifsURLResponse>;
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
