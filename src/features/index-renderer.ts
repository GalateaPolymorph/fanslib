import { AnalyticsIpcChannel, AnalyticsIpcHandlers, analyticsMethods } from "./analytics/api-type";
import {
  APIPostponeIpcChannel,
  APIPostponeIpcHandlers,
  apiPostponeMethods,
} from "./api-postpone/api-type";
import {
  AutomationIpcChannel,
  AutomationIpcHandlers,
  automationMethods,
} from "./automation/api-type";
import { ChannelIpcChannel, ChannelIpcHandlers, channelMethods } from "./channels/api-type";
import {
  ContentScheduleIpcChannel,
  ContentScheduleIpcHandlers,
  contentScheduleMethods,
} from "./content-schedules/api-type";
import {
  FilterPresetIpcChannel,
  FilterPresetIpcHandlers,
  filterPresetMethods,
} from "./filter-presets/api-type";
import { HashtagIpcChannel, HashtagIpcHandlers, hashtagMethods } from "./hashtags/api-type";
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

export type IpcHandlers = ChannelIpcHandlers &
  ContentScheduleIpcHandlers &
  FilterPresetIpcHandlers &
  LibraryIpcHandlers &
  NotificationIpcHandlers &
  OsIpcHandlers &
  PostIpcHandlers &
  SettingsIpcHandlers &
  ShootIpcHandlers &
  HashtagIpcHandlers &
  APIPostponeIpcHandlers &
  AnalyticsIpcHandlers &
  TagIpcHandlers &
  AutomationIpcHandlers;

export const ipcMethods = [
  ...channelMethods,
  ...contentScheduleMethods,
  ...filterPresetMethods,
  ...libraryMethods,
  ...notificationMethods,
  ...osMethods,
  ...postMethods,
  ...settingsMethods,
  ...shootMethods,
  ...hashtagMethods,
  ...apiPostponeMethods,
  ...analyticsMethods,
  ...tagMethods,
  ...automationMethods,
];

export type IpcChannel =
  | ChannelIpcChannel
  | ContentScheduleIpcChannel
  | FilterPresetIpcChannel
  | LibraryIpcChannel
  | NotificationIpcChannel
  | OsIpcChannel
  | PostIpcChannel
  | SettingsIpcChannel
  | ShootIpcChannel
  | HashtagIpcChannel
  | APIPostponeIpcChannel
  | AnalyticsIpcChannel
  | TagIpcChannel
  | AutomationIpcChannel;
