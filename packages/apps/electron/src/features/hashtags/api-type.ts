import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Hashtag, HashtagChannelStats } from "./entity";

export type HashtagWithStats = Hashtag & {
  channelStats: HashtagChannelStats[];
};

export const methods = ["stats:set", "stats:get", "list", "create", "delete"] as const;
export type HashtagHandlers = {
  "stats:set": (
    _: unknown,
    hashtagId: number,
    channelId: string,
    viewCount: number
  ) => Promise<void>;
  "stats:get": (_: unknown, hashtagId: number) => Promise<HashtagChannelStats[]>;
  list: (_: unknown) => Promise<HashtagWithStats[]>;
  create: (_: unknown, name: string) => Promise<HashtagWithStats>;
  delete: (_: unknown, hashtagId: number) => Promise<void>;
};

export const namespace = "hashtag" as const;
export const hashtagMethods = methods.map((m) => prefixNamespace(namespace, m));
export type HashtagIpcChannel = keyof PrefixNamespace<HashtagHandlers, typeof namespace>;
export type HashtagIpcHandlers = {
  [K in HashtagIpcChannel]: HashtagHandlers[StripNamespace<K, typeof namespace>];
};
