import { CategoryIpcChannel, CategoryIpcHandlers, categoryMethods } from "./categories/api-type";
import { ChannelIpcChannel, ChannelIpcHandlers, channelMethods } from "./channels/api-type";
import {
  ContentScheduleIpcChannel,
  ContentScheduleIpcHandlers,
  contentScheduleMethods,
} from "./content-schedules/api-type";
import { LibraryIpcChannel, LibraryIpcHandlers, libraryMethods } from "./library/api-type";
import {
  NotificationIpcChannel,
  NotificationIpcHandlers,
  notificationMethods,
} from "./notifications/api-type";
import { OsIpcChannel, OsIpcHandlers, osMethods } from "./os/api-type";
import { PostIpcChannel, PostIpcHandlers, postMethods } from "./posts/api-type";
import { SettingsIpcChannel, SettingsIpcHandlers, settingsMethods } from "./settings/api-type";
import { ShootIpcChannel, ShootIpcHandlers, shootMethods } from "./shoots/api-type";
import { TagIpcChannel, TagIpcHandlers, tagMethods } from "./tags/api-type";
import { TierIpcChannel, TierIpcHandlers, tierMethods } from "./tiers/api-type";

export type IpcHandlers = CategoryIpcHandlers &
  ChannelIpcHandlers &
  ContentScheduleIpcHandlers &
  LibraryIpcHandlers &
  NotificationIpcHandlers &
  OsIpcHandlers &
  PostIpcHandlers &
  SettingsIpcHandlers &
  ShootIpcHandlers &
  TagIpcHandlers &
  TierIpcHandlers;

export const ipcMethods = [
  ...categoryMethods,
  ...channelMethods,
  ...contentScheduleMethods,
  ...libraryMethods,
  ...notificationMethods,
  ...osMethods,
  ...postMethods,
  ...settingsMethods,
  ...shootMethods,
  ...tagMethods,
  ...tierMethods,
];

export type IpcChannel =
  | CategoryIpcChannel
  | ChannelIpcChannel
  | ContentScheduleIpcChannel
  | LibraryIpcChannel
  | NotificationIpcChannel
  | OsIpcChannel
  | PostIpcChannel
  | SettingsIpcChannel
  | ShootIpcChannel
  | TagIpcChannel
  | TierIpcChannel;
