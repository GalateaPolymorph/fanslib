import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Channel, ChannelType, ChannelWithoutRelations } from "./entity";

export type ChannelCreatePayload = Omit<ChannelWithoutRelations, "id">;
const methods = [
  "create",
  "getAll",
  "getById",
  "delete",
  "update",
  "getTypes",
  "updateDefaultHashtags",
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
};

export const namespace = "channel" as const;
export const channelMethods = methods.map((m) => prefixNamespace(namespace, m));
export type ChannelIpcChannel = keyof PrefixNamespace<ChannelHandlers, typeof namespace>;
export type ChannelIpcHandlers = {
  [K in ChannelIpcChannel]: ChannelHandlers[StripNamespace<K, typeof namespace>];
};
