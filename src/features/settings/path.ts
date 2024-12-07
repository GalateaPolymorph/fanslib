import { app } from "electron";
import path from "path";

export const settingsFilePath = () => path.join(app.getPath("userData"), "settings.json");
