import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Channel } from "../channels/entity";
import { MediaFilters } from "../library/api-type";
import { ContentSchedule } from "./entity";

export type ContentScheduleCreateData = {
  channelId: string;
  type: "daily" | "weekly" | "monthly";
  postsPerTimeframe?: number;
  preferredDays?: string[];
  preferredTimes?: string[];
  mediaFilters?: MediaFilters;
};

export type ContentScheduleUpdateData = {
  type?: "daily" | "weekly" | "monthly";
  postsPerTimeframe?: number;
  preferredDays?: string[];
  preferredTimes?: string[];
  mediaFilters?: MediaFilters | null;
};

const methods = ["getAll", "getByChannel", "create", "update", "delete"] as const;
export type ContentScheduleHandlers = {
  getAll: (_: any) => Promise<ContentSchedule[]>;
  getByChannel: (_: any, channelId: Channel["id"]) => Promise<ContentSchedule[]>;
  create: (_: any, data: ContentScheduleCreateData) => Promise<ContentSchedule>;
  update: (
    _: any,
    id: ContentSchedule["id"],
    updates: ContentScheduleUpdateData
  ) => Promise<ContentSchedule | null>;
  delete: (_: any, id: ContentSchedule["id"]) => Promise<void>;
};

export const namespace = "content-schedule" as const;
export const contentScheduleMethods = methods.map((m) => prefixNamespace(namespace, m));
export type ContentScheduleIpcChannel = keyof PrefixNamespace<
  ContentScheduleHandlers,
  typeof namespace
>;
export type ContentScheduleIpcHandlers = {
  [K in ContentScheduleIpcChannel]: ContentScheduleHandlers[StripNamespace<K, typeof namespace>];
};
