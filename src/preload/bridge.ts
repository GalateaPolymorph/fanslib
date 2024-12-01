import { contextBridge } from "electron";
import { categoryBridge } from "../features/categories/preload";
import { channelBridge } from "../features/channels/preload";
import { contentScheduleBridge } from "../features/content-schedules/preload";
import { libraryBridge } from "../features/library/preload";
import { osBridge } from "../features/os/preload";
import { postsBridge } from "../features/posts/preload/index";
import { settingsBridge } from "../features/settings/preload";

const bridge = {
  settings: settingsBridge,
  library: libraryBridge,
  os: osBridge,
  category: categoryBridge,
  channel: channelBridge,
  contentSchedule: contentScheduleBridge,
  posts: postsBridge,
};

export type AppAPI = typeof bridge;

export const exposeBridge = () => {
  contextBridge.exposeInMainWorld("api", bridge);
};
