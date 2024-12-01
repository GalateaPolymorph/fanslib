import { ipcRenderer } from "electron";
import { OsAPI } from "../api";

export const osBridge: OsAPI = {
  revealInFinder: (path) => {
    ipcRenderer.invoke("os:reveal-in-finder", path);
  },
};
