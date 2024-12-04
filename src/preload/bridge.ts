import { contextBridge } from "electron";
import { categoriesBridge } from "../features/categories/preload";
import { channelsBridge } from "../features/channels/preload";
import { contentSchedulesBridge } from "../features/content-schedules/preload";
import { libraryBridge } from "../features/library/preload";
import { osBridge } from "../features/os/preload";
import { postsBridge } from "../features/posts/preload/index";
import { settingsBridge } from "../features/settings/preload";

const bridge = {
  settings: settingsBridge,
  library: libraryBridge,
  os: osBridge,
  category: categoriesBridge,
  channel: channelsBridge,
  contentSchedule: contentSchedulesBridge,
  posts: postsBridge,
};

export type AppAPI = typeof bridge;

export const exposeBridge = () => {
  contextBridge.exposeInMainWorld("api", bridge);
};
