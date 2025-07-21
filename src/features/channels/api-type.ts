import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import type { MediaFilters } from "../library/api-type";
import { Channel, ChannelType, ChannelWithoutRelations } from "./entity";
import { Subreddit } from "./subreddit";
import { VerificationStatus } from "./type";

export type ChannelCreatePayload = {
  name: string;
  typeId: string;
  description?: string;
  eligibleMediaFilter?: MediaFilters;
};

export type SubredditCreatePayload = {
  name: string;
  maxPostFrequencyHours?: number;
  notes?: string;
  memberCount?: number;
  verificationStatus?: VerificationStatus;
  eligibleMediaFilter?: MediaFilters;
  defaultFlair?: string;
  captionPrefix?: string;
};

export type SubredditPostingTime = {
  day: number;
  hour: number;
  posts: number;
  score: number; // Normalized score 1-100
};

export type SubredditUpdatePayload = {
  name: string;
  maxPostFrequencyHours?: number;
  notes?: string;
  memberCount?: number;
  verificationStatus?: VerificationStatus;
  eligibleMediaFilter?: MediaFilters;
  defaultFlair?: string;
  captionPrefix?: string;
  postingTimesData?: SubredditPostingTime[];
  postingTimesLastFetched?: Date;
  postingTimesTimezone?: string;
};

const methods = [
  "create",
  "getAll",
  "getById",
  "delete",
  "update",
  "getTypes",
  "updateDefaultHashtags",
  "subreddit-create",
  "subreddit-list",
  "subreddit-update",
  "subreddit-delete",
  "subreddit-last-post-dates",
  "subreddit-analyze-posting-times",
] as const;

export type ChannelHandlers = {
  create: (_: any, data: ChannelCreatePayload) => Promise<Channel>;
  getAll: (_: any) => Promise<Channel[]>;
  getById: (_: any, id: string) => Promise<Channel | null>;
  delete: (_: any, id: string) => Promise<void>;
  update: (
    _: any,
    id: string,
    updates: Partial<Omit<ChannelWithoutRelations, "id">>
  ) => Promise<Channel | null>;
  getTypes: (_: any) => ChannelType[];
  updateDefaultHashtags: (_: any, channelId: string, hashtags: string[]) => Promise<void>;
  "subreddit-create": (_: any, data: SubredditCreatePayload) => Promise<Subreddit>;
  "subreddit-list": (_: any) => Promise<Subreddit[]>;
  "subreddit-update": (_: any, id: string, updates: SubredditUpdatePayload) => Promise<Subreddit>;
  "subreddit-delete": (_: any, id: string) => Promise<void>;
  "subreddit-last-post-dates": (_: any, subredditIds: string[]) => Promise<Record<string, string>>;
  "subreddit-analyze-posting-times": (_: any, id: string, timezone?: string) => Promise<Subreddit>;
};

export const namespace = "channel" as const;
export const channelMethods = methods.map((m) => prefixNamespace(namespace, m));
export type ChannelIpcChannel = keyof PrefixNamespace<ChannelHandlers, typeof namespace>;
export type ChannelIpcHandlers = {
  [K in ChannelIpcChannel]: ChannelHandlers[StripNamespace<K, typeof namespace>];
};
