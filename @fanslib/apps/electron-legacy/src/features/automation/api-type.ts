import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { RedditPostResult } from "@fanslib/reddit-automation";

export type { RedditPostResult };

export type PostToRedditPayload = {
  subredditId: string;
  mediaId: string;
  caption: string;
};

const methods = ["postToReddit"] as const;
export type AutomationHandlers = {
  postToReddit: (_: any, payload: PostToRedditPayload) => Promise<RedditPostResult>;
};

export const namespace = "automation" as const;
export const automationMethods = methods.map((m) => prefixNamespace(namespace, m));
export type AutomationIpcChannel = keyof PrefixNamespace<AutomationHandlers, typeof namespace>;
export type AutomationIpcHandlers = {
  [K in AutomationIpcChannel]: AutomationHandlers[StripNamespace<K, typeof namespace>];
};
