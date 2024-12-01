import chokidar, { FSWatcher } from "chokidar";
import { BrowserWindow, ipcMain } from "electron";
import { Media } from "../../../lib/database/media/type";
import { updateMedia } from "../../../lib/database/media/update";
import { resetAllDatabases } from "../../../lib/database/reset";
import { loadSettings } from "../../settings/main/load";
import { scanLibraryForMediaFiles } from "./scan";
import { fetchAllMedia } from "../../../lib/database/media/fetch";

let watcher: FSWatcher | null = null;

export const registerLibraryHandlers = () => {
  ipcMain.handle("library:scan", async (_event, libraryPath: string) => {
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
  });

  ipcMain.handle("library:get-all", async () => {
    const settings = await loadSettings();
    if (!settings?.libraryPath) {
      return [];
    }
    return fetchAllMedia();
  });

  ipcMain.handle("library:update-media", async (_event, path: string, updates: Partial<Media>) => {
    await updateMedia(path, updates);
    
    // Notify all windows about the change
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      const allMedia = await fetchAllMedia();
      win.webContents.send("library:changed", allMedia);
    }
  });

  ipcMain.handle("library:reset", async () => {
    await resetAllDatabases();
  });
};
