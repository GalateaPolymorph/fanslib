import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import type {
  FanslyAutomationResult,
  FanslyAutomationOptions,
  PostDiscoveryOptions,
} from "./playwright-fansly-automation/context";

export type RedditPostResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export type PostToRedditPayload = {
  subredditId: string;
  mediaId: string;
  caption: string;
};

// Fansly automation types
export type FanslyFullAutomationPayload = FanslyAutomationOptions &
  PostDiscoveryOptions & {
    email?: string;
    password?: string;
  };

export type FanslyCredentialExtractionPayload = FanslyAutomationOptions & {
  email?: string;
  password?: string;
};

export type FanslyPostDiscoveryPayload = FanslyAutomationOptions & PostDiscoveryOptions;

const methods = [
  "postToReddit",
  "runFanslyFullAutomation",
  "extractFanslyCredentials",
  "discoverFanslyPosts",
  "clearFanslySession",
] as const;

export type AutomationHandlers = {
  postToReddit: (_: any, payload: PostToRedditPayload) => Promise<RedditPostResult>;
  runFanslyFullAutomation: (
    _: any,
    payload: FanslyFullAutomationPayload
  ) => Promise<FanslyAutomationResult>;
  extractFanslyCredentials: (
    _: any,
    payload: FanslyCredentialExtractionPayload
  ) => Promise<FanslyAutomationResult>;
  discoverFanslyPosts: (
    _: any,
    payload: FanslyPostDiscoveryPayload
  ) => Promise<FanslyAutomationResult>;
  clearFanslySession: (_: any) => Promise<void>;
};

export const namespace = "automation" as const;
export const automationMethods = methods.map((m) => prefixNamespace(namespace, m));
export type AutomationIpcChannel = keyof PrefixNamespace<AutomationHandlers, typeof namespace>;
export type AutomationIpcHandlers = {
  [K in AutomationIpcChannel]: AutomationHandlers[StripNamespace<K, typeof namespace>];
};
