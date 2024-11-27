import { contextBridge } from "electron";
import { settingsBridge } from "../features/settings/preload";
import { libraryBridge } from "../features/library/preload";

const bridge = {
  ...settingsBridge,
  ...libraryBridge
};

export type AppAPI = typeof bridge;

export const exposeBridge = () => {
  contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods
    "api",
    bridge
  );
};
