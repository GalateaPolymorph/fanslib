import { AnalyticsIpcChannel, AnalyticsIpcHandlers, analyticsMethods } from "./analytics/api-type";
import {
  APIPostponeIpcChannel,
  APIPostponeIpcHandlers,
  apiPostponeMethods,
} from "./api-postpone/api-type";
import { ChannelIpcChannel, ChannelIpcHandlers, channelMethods } from "./channels/api-type";
import {
  ContentScheduleIpcChannel,
  ContentScheduleIpcHandlers,
  contentScheduleMethods,
} from "./content-schedules/api-type";
import { HashtagIpcChannel, HashtagIpcHandlers, hashtagMethods } from "./hashtags/api-type";
import { LibraryIpcChannel, LibraryIpcHandlers, libraryMethods } from "./library/api-type";
import { NicheIpcChannel, NicheIpcHandlers, nicheMethods } from "./niches/api-type";
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

export type IpcHandlers = ChannelIpcHandlers &
  ContentScheduleIpcHandlers &
  LibraryIpcHandlers &
  NotificationIpcHandlers &
  OsIpcHandlers &
  PostIpcHandlers &
  SettingsIpcHandlers &
  ShootIpcHandlers &
  HashtagIpcHandlers &
  NicheIpcHandlers &
  APIPostponeIpcHandlers &
  AnalyticsIpcHandlers &
  TagIpcHandlers;

export const ipcMethods = [
  ...channelMethods,
  ...contentScheduleMethods,
  ...libraryMethods,
  ...notificationMethods,
  ...osMethods,
  ...postMethods,
  ...settingsMethods,
  ...shootMethods,
  ...hashtagMethods,
  ...nicheMethods,
  ...apiPostponeMethods,
  ...analyticsMethods,
  ...tagMethods,
];

export type IpcChannel =
  | ChannelIpcChannel
  | ContentScheduleIpcChannel
  | LibraryIpcChannel
  | NotificationIpcChannel
  | OsIpcChannel
  | PostIpcChannel
  | SettingsIpcChannel
  | ShootIpcChannel
  | HashtagIpcChannel
  | NicheIpcChannel
  | APIPostponeIpcChannel
  | AnalyticsIpcChannel
  | TagIpcChannel;
