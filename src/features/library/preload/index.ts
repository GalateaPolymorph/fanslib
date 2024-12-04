import { ipcRenderer } from "electron";
import { LibraryAPI } from "../types";
import { Media } from "../../../lib/database/media/type";

export const libraryBridge: LibraryAPI = {
  scan: (libraryPath) => ipcRenderer.invoke("library:scan", libraryPath),
  getAllMedia: () => ipcRenderer.invoke("library:get-all"),
  updateMedia: (path, updates) => ipcRenderer.invoke("library:update-media", path, updates),
  resetDatabase: () => ipcRenderer.invoke("library:reset"),
  onLibraryChanged: (callback: (media: Media[]) => void) => {
    ipcRenderer.on("library:changed", (_event, media: Media[]) => callback(media));
  },
  offLibraryChanged: (callback: (media: Media[]) => void) => {
    ipcRenderer.removeListener("library:changed", (_event, media: Media[]) => callback(media));
  },
};
