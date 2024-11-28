import { ipcRenderer } from "electron";
import { Media } from "../shared/types";

export const libraryBridge = {
  scan: (libraryPath: string): Promise<Media[]> => {
    return ipcRenderer.invoke("library:scan", libraryPath);
  },
  onLibraryChanged: (callback: (event: any, files: Media[]) => void) => {
    ipcRenderer.on("library:changed", callback);
  },
  removeLibraryChangeListener: (callback: (event: any, files: Media[]) => void) => {
    ipcRenderer.removeListener("library:changed", callback);
  },
  resetDatabase: (): Promise<void> => {
    return ipcRenderer.invoke("library:resetDatabase");
  },
  updateMedia: (path: string, data: Partial<Media>): Promise<Media> => {
    return ipcRenderer.invoke("library:update-media", path, data);
  },
};
