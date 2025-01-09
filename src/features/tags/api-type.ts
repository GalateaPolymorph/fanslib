import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Tag } from "./entity";

export type CreateTagDto = {
  name: string;
  hashtags?: string[];
};

export type UpdateTagDto = {
  name?: string;
  hashtags?: string[];
};

const methods = ["create", "update", "delete", "getAll", "getById"] as const;

export type TagHandlers = {
  create: (_: any, dto: CreateTagDto) => Promise<Tag>;
  update: (_: any, id: number, dto: UpdateTagDto) => Promise<Tag>;
  delete: (_: any, id: number) => Promise<void>;
  getAll: (_: any) => Promise<Tag[]>;
  getById: (_: any, id: number) => Promise<Tag>;
};

export const namespace = "tag" as const;
export const tagMethods = methods.map((m) => prefixNamespace(namespace, m));
export type TagIpcChannel = keyof PrefixNamespace<TagHandlers, typeof namespace>;
export type TagIpcHandlers = {
  [K in TagIpcChannel]: TagHandlers[StripNamespace<K, typeof namespace>];
};
