import { ipcRenderer } from "electron";
import { LibraryAPI } from "../types";

export const libraryBridge: LibraryAPI = {
  scan: (libraryPath) => ipcRenderer.invoke("library:scan", libraryPath),
  getAllMedia: () => ipcRenderer.invoke("library:get-all"),
  updateMedia: (path, updates) => ipcRenderer.invoke("library:update-media", path, updates),
  resetDatabase: () => ipcRenderer.invoke("library:reset"),
};
