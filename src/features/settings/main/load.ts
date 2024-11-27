import { ipcMain } from "electron";
import * as fs from "fs/promises";
import * as path from "path";
import { DEFAULT_SETTINGS, getSettingsFilePath } from "./constants";
import type { Settings } from "./types";

const ensureSettingsFile = async (): Promise<void> => {
  try {
    await fs.access(getSettingsFilePath());
  } catch (error) {
    await fs.mkdir(path.dirname(getSettingsFilePath()), { recursive: true });
    await fs.writeFile(
      getSettingsFilePath(),
      JSON.stringify(DEFAULT_SETTINGS, null, 2)
    );
  }
};

export const registerLoadHandler = () => {
  ipcMain.handle("settings:load", async (event) => {
    try {
      await ensureSettingsFile();
      const data = await fs.readFile(getSettingsFilePath(), "utf8");
      return JSON.parse(data) as Settings;
    } catch (error) {
      console.error("Error loading settings:", error);
      return DEFAULT_SETTINGS;
    }
  });
};
