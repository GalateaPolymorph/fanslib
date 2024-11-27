import { ipcMain } from "electron";
import * as fs from "fs/promises";
import * as path from "path";
import { DEFAULT_SETTINGS, getSettingsFilePath } from "./constants";
import type { Settings } from "./types";

export const registerSaveHandler = () => {
  ipcMain.handle("settings:save", async (event, partialSettings: Partial<Settings>) => {
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(getSettingsFilePath()), { recursive: true });

      const currentSettings = await fs.readFile(getSettingsFilePath(), "utf8")
        .then((data) => JSON.parse(data) as Settings)
        .catch(() => DEFAULT_SETTINGS);
      
      const newSettings = { ...currentSettings, ...partialSettings };
      await fs.writeFile(getSettingsFilePath(), JSON.stringify(newSettings, null, 2));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  });
};
