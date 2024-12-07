import { CategoryIpcChannel, CategoryIpcHandlers, categoryMethods } from "./categories/api-type";
import { ChannelIpcChannel, ChannelIpcHandlers, channelMethods } from "./channels/api-type";
import {
  ContentScheduleIpcChannel,
  ContentScheduleIpcHandlers,
  contentScheduleMethods,
} from "./content-schedules/api-type";
import { LibraryIpcChannel, LibraryIpcHandlers, libraryMethods } from "./library/api-type";
import { OsIpcChannel, OsIpcHandlers, osMethods } from "./os/api-type";
import { PostIpcChannel, PostIpcHandlers, postMethods } from "./posts/api-type";
import { SettingsIpcChannel, SettingsIpcHandlers, settingsMethods } from "./settings/api-type";

export type IpcHandlers = CategoryIpcHandlers &
  ChannelIpcHandlers &
  ContentScheduleIpcHandlers &
  LibraryIpcHandlers &
  OsIpcHandlers &
  PostIpcHandlers &
  SettingsIpcHandlers;

export const ipcMethods = [
  ...categoryMethods,
  ...channelMethods,
  ...contentScheduleMethods,
  ...libraryMethods,
  ...osMethods,
  ...postMethods,
  ...settingsMethods,
];
export type IpcChannel =
  | CategoryIpcChannel
  | ChannelIpcChannel
  | ContentScheduleIpcChannel
  | LibraryIpcChannel
  | OsIpcChannel
  | PostIpcChannel
  | SettingsIpcChannel;
