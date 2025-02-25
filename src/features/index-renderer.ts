import {
  APIPostponeIpcChannel,
  APIPostponeIpcHandlers,
  apiPostponeMethods,
} from "./api-postpone/api-type";
import { CategoryIpcChannel, CategoryIpcHandlers, categoryMethods } from "./categories/api-type";
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
  HashtagIpcHandlers &
  TierIpcHandlers &
  NicheIpcHandlers &
  APIPostponeIpcHandlers;

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
  ...tierMethods,
  ...hashtagMethods,
  ...nicheMethods,
  ...apiPostponeMethods,
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
  | TierIpcChannel
  | HashtagIpcChannel
  | NicheIpcChannel
  | APIPostponeIpcChannel;
