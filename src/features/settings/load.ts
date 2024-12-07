import * as fs from "fs/promises";
import * as path from "path";
import { DEFAULT_SETTINGS, type Settings } from "./entity";
import { settingsFilePath } from "./path";

const ensureSettingsFile = async (): Promise<void> => {
  try {
    await fs.access(settingsFilePath());
  } catch {
    await fs.mkdir(path.dirname(settingsFilePath()), { recursive: true });
    await fs.writeFile(settingsFilePath(), JSON.stringify(DEFAULT_SETTINGS, null, 2));
  }
};

export const loadSettings = async (): Promise<Settings> => {
  try {
    await ensureSettingsFile();
    const data = await fs.readFile(settingsFilePath(), "utf8");
    return JSON.parse(data) as Settings;
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
};
