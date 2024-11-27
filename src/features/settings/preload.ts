import { ipcRenderer } from "electron";

export const settingsBridge = {
  settingsSave: (message) => ipcRenderer.invoke("settings:save", message),
  settingsLoad: () => ipcRenderer.invoke("settings:load"),
};
