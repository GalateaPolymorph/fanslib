import * as fs from "fs/promises";
import * as path from "path";
import { DEFAULT_SETTINGS, type Settings } from "./entity";
import { settingsFilePath } from "./path";

export const saveSettings = async (partialSettings: Partial<Settings>) => {
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(settingsFilePath()), { recursive: true });

    const currentSettings = await fs
      .readFile(settingsFilePath(), "utf8")
      .then((data) => JSON.parse(data) as Settings)
      .catch(() => DEFAULT_SETTINGS);

    const newSettings = { ...currentSettings, ...partialSettings };
    await fs.writeFile(settingsFilePath(), JSON.stringify(newSettings, null, 2));
    return newSettings;
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};
