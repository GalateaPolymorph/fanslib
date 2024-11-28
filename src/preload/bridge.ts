import { contextBridge } from "electron";
import { libraryBridge } from "../features/library/preload";
import { osBridge } from "../features/os/preload";
import { settingsBridge } from "../features/settings/preload";

const bridge = {
  settings: settingsBridge,
  library: libraryBridge,
  os: osBridge,
};

export type AppAPI = typeof bridge;

export const exposeBridge = () => {
  contextBridge.exposeInMainWorld("api", bridge);
};
