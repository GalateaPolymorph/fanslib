import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Post, PostStatus } from "./entity";

export type PostFilters = {
  search?: string;
  channels?: string[];
  statuses?: PostStatus[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
};

export type PostCreateData = {
  date: string;
  channelId: string;
  categoryId?: string;
  caption?: string;
  status: PostStatus;
  tierId?: number;
  url?: string;
};

export const methods = [
  "create",
  "getAll",
  "byId",
  "bySchedule",
  "byChannel",
  "byMediaId",
  "update",
  "delete",
  "addMedia",
  "removeMedia",
  "setFreePreview",
] as const;

export type PostHandlers = {
  create: (_: any, data: PostCreateData, mediaIds: string[]) => Promise<Post>;
  getAll: (_: any, filters?: PostFilters) => Promise<Post[]>;
  byId: (_: any, id: string) => Promise<Post | null>;
  bySchedule: (_: any, scheduleId: string) => Promise<Post[]>;
  byChannel: (_: any, channelId: string) => Promise<Post[]>;
  byMediaId: (_: any, mediaPath: string) => Promise<Post[]>;
  update: (
    _: any,
    id: string,
    updates: Partial<Post>,
    newMediaPathsInOrder?: string[]
  ) => Promise<Post | null>;
  delete: (_: any, id: string) => Promise<void>;
  addMedia: (_: any, postId: string, mediaPaths: string[]) => Promise<Post | null>;
  removeMedia: (_: any, postId: string, mediaPaths: string[]) => Promise<Post | null>;
  setFreePreview: (
    _: any,
    postId: string,
    mediaId: string,
    isFreePreview: boolean
  ) => Promise<Post | null>;
};

export const namespace = "post" as const;
export const postMethods = methods.map((m) => prefixNamespace(namespace, m));
export type PostIpcChannel = keyof PrefixNamespace<PostHandlers, typeof namespace>;
export type PostIpcHandlers = {
  [K in PostIpcChannel]: PostHandlers[StripNamespace<K, typeof namespace>];
};
