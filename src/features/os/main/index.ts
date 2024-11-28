import { ipcMain, shell } from "electron";
import fs from "fs";
import path from "path";

export function registerOsHandlers() {
  ipcMain.handle("os:reveal-in-finder", async (_event, filePath: string) => {
    try {
      // Ensure the file exists before trying to reveal it
      if (fs.existsSync(filePath)) {
        shell.showItemInFolder(path.normalize(filePath));
        return { success: true };
      } else {
        throw new Error("File does not exist");
      }
    } catch (error) {
      console.error("Failed to reveal file:", error);
      throw error;
    }
  });
}
