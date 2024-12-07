import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Post, PostStatus } from "./entity";

export type PostCreateData = {
  scheduleId: string;
  channelId: string;
  categorySlug?: string;
  caption: string;
  scheduledDate: string;
  status: PostStatus;
};

export const methods = [
  "create",
  "getAll",
  "bySchedule",
  "byChannel",
  "byMediaPath",
  "update",
  "markAsScheduled",
  "markAsPosted",
  "markAsPlanned",
  "delete",
  "addMedia",
  "removeMedia",
] as const;
export type PostHandlers = {
  create: (_: any, data: PostCreateData) => Promise<Post>;
  getAll: (_: any) => Promise<Post[]>;
  bySchedule: (_: any, scheduleId: string) => Promise<Post[]>;
  byChannel: (_: any, channelId: string) => Promise<Post[]>;
  byMediaPath: (_: any, mediaPath: string) => Promise<Post[]>;
  update: (
    _: any,
    id: string,
    updates: Partial<Post>,
    newMediaPathsInOrder?: string[]
  ) => Promise<Post | null>;
  markAsScheduled: (_: any, id: string) => Promise<Post | null>;
  markAsPosted: (_: any, id: string) => Promise<Post | null>;
  markAsPlanned: (_: any, id: string) => Promise<Post | null>;
  delete: (_: any, id: string) => Promise<void>;
  addMedia: (_: any, postId: string, mediaPaths: string[]) => Promise<Post | null>;
  removeMedia: (_: any, postId: string, mediaPaths: string[]) => Promise<Post | null>;
};

export const namespace = "post" as const;
export const postMethods = methods.map((m) => prefixNamespace(namespace, m));
export type PostIpcChannel = keyof PrefixNamespace<PostHandlers, typeof namespace>;
export type PostIpcHandlers = {
  [K in PostIpcChannel]: PostHandlers[StripNamespace<K, typeof namespace>];
};
