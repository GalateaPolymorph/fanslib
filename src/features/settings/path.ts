import { app } from "electron";
import path from "path";
import { isDevelopmentMode } from "../../lib/development-mode";

export const settingsFilePath = () => {
  const userData = app.getPath("userData");
  const filePath = path.join(userData, isDevelopmentMode() ? "settings-dev.json" : "settings.json");
  return filePath;
};
