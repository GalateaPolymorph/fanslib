import chokidar, { FSWatcher } from "chokidar";
import { BrowserWindow } from "electron";
import { prefixNamespaceObject } from "../../lib/namespace";
import { loadSettings } from "../settings/load";
import { LibraryHandlers, namespace } from "./api-type";
import { fetchAllMedia, updateMedia } from "./operations";
import { scanLibraryForMediaFiles } from "./scan";

let watcher: FSWatcher | null = null;

export const handlers: LibraryHandlers = {
  scan: async () => {
    const { libraryPath } = await loadSettings();

    if (!libraryPath) return [];
    // Stop any existing watcher
    if (watcher) {
      await watcher.close();
    }

    // Set up new watcher
    watcher = chokidar.watch(libraryPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
    });

    // Notify renderer of changes
    const notifyChange = async () => {
      const win = BrowserWindow.getAllWindows()[0];
      if (!win) return;
      win.webContents.send("library:changed", await scanLibraryForMediaFiles(libraryPath));
    };

    // Watch for file changes
    watcher.on("add", notifyChange).on("unlink", notifyChange).on("unlinkDir", notifyChange);

    // Initial scan
    return scanLibraryForMediaFiles(libraryPath);
  },
  getAll: () => fetchAllMedia(),
  update: async (_, path, updates) => {
    await updateMedia(path, updates);

    // Notify all windows about the change
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      const allMedia = await fetchAllMedia();
      win.webContents.send("library:changed", allMedia);
    }
  },
  onLibraryChanged: (_) => {}, // Stub for preload event listener
  offLibraryChanged: (_) => {}, // Stub for preload event listener
};

export const libraryHandlers = prefixNamespaceObject(namespace, handlers);
