import chokidar, { FSWatcher } from "chokidar";
import { BrowserWindow, ipcMain } from "electron";
import { getMediaFileByPath, resetDatabase, upsertMediaFile } from "./db";
import { getMediaFiles } from "./getMediaFiles";

let watcher: FSWatcher | null = null;

export function registerLibraryHandlers() {
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

    // Get media files and store them in the database
    const files = await getMediaFiles(libraryPath);
    files.forEach((file) => {
      const existingRecord = getMediaFileByPath(file.path);
      if (!existingRecord) {
        upsertMediaFile(file, { isNew: true });
      }
    });

    // Notify renderer of changes
    const notifyChange = async () => {
      const win = BrowserWindow.getAllWindows()[0];
      if (win) {
        const updatedFiles = await getMediaFiles(libraryPath);
        // Update database with any changes
        updatedFiles.forEach((file) => {
          const existingRecord = getMediaFileByPath(file.path);
          if (!existingRecord) {
            upsertMediaFile(file, { isNew: true });
          }
        });
        win.webContents.send("library:changed", updatedFiles);
      }
    };

    // Watch for file changes
    watcher.on("add", notifyChange).on("unlink", notifyChange).on("unlinkDir", notifyChange);

    return files;
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
}
