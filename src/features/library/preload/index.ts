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

  createCategory: (name: string) => ipcRenderer.invoke("library:create-category", name),
  getAllCategories: () => ipcRenderer.invoke("library:get-categories"),
  deleteCategory: (slug: string) => ipcRenderer.invoke("library:delete-category", slug),
  updateCategory: (slug: string, updates: { color?: string }) =>
    ipcRenderer.invoke("library:update-category", slug, updates),
};
