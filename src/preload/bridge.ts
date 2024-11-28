import { contextBridge } from "electron";
import { settingsBridge } from "../features/settings/preload";
import { libraryBridge } from "../features/library/preload";

const bridge = {
  settings: settingsBridge,
  library: libraryBridge
};

export type AppAPI = typeof bridge;

export const exposeBridge = () => {
  contextBridge.exposeInMainWorld(
    "api",
    bridge
  );
};
