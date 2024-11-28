import { ipcRenderer } from "electron";

export const osBridge = {
  revealInFinder: (path: string): Promise<void> => {
    return ipcRenderer.invoke("os:reveal-in-finder", path);
  },
};
