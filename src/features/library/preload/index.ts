import { ipcRenderer } from "electron";
import { MediaFile } from "../shared/types";

export const libraryBridge = {
  scan: (libraryPath: string): Promise<MediaFile[]> => {
    return ipcRenderer.invoke("library:scan", libraryPath);
  },
  onLibraryChanged: (callback: (event: any, files: MediaFile[]) => void) => {
    ipcRenderer.on("library:changed", callback);
  },
  removeLibraryChangeListener: (callback: (event: any, files: MediaFile[]) => void) => {
    ipcRenderer.removeListener("library:changed", callback);
  },
  resetDatabase: (): Promise<void> => {
    return ipcRenderer.invoke("library:resetDatabase");
  },
};
