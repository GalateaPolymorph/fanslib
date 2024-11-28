import chokidar, { FSWatcher } from "chokidar";
import { BrowserWindow, ipcMain } from "electron";
import { resetDatabase } from "../../../lib/database/media/base";
import { createNewMediaData } from "../../../lib/database/media/create";
import { fetchMediaDataByPath } from "../../../lib/database/media/fetch";
import { MediaFile } from "../shared/types";
import { registerCategoryHandlers } from "./categoryHandlers";
import { scanLibraryForMediaFiles } from "./scan";

let watcher: FSWatcher | null = null;

const initializeMediaFile = async (file: MediaFile) => {
  const mediaData = await fetchMediaDataByPath(file.path).then((data) =>
    data ? data : createNewMediaData(file)
  );
  return {
    ...file,
    ...mediaData,
  };
};

const fetchAllMediaInPath = async (libraryPath: string) => {
  return scanLibraryForMediaFiles(libraryPath).then((files) => {
    return Promise.all(files.map(initializeMediaFile));
  });
};

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
      win.webContents.send("library:changed", await fetchAllMediaInPath(libraryPath));
    };

    // Watch for file changes
    watcher.on("add", notifyChange).on("unlink", notifyChange).on("unlinkDir", notifyChange);

    return fetchAllMediaInPath(libraryPath);
  });

  ipcMain.handle("library:stop-watch", async () => {
    if (watcher) {
      await watcher.close();
      watcher = null;
    }
  });

  ipcMain.handle("library:resetDatabase", async () => {
    if (watcher) {
      await watcher.close();
      watcher = null;
    }
    await resetDatabase();
  });

  registerCategoryHandlers();
};
