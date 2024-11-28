import { app } from "electron";
import path from "path";
import type { Settings } from "./types";

export const getSettingsFilePath = () => path.join(app.getPath("userData"), "settings.json");

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  theme: "dark",
  libraryPath: "",
} as const;
