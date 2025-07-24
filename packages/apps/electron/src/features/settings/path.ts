import { app } from "electron";
import path from "path";

export const settingsFilePath = () => {
  const userData = app.getPath("userData");
  const filePath = path.join(userData, "settings.json");
  return filePath;
};
