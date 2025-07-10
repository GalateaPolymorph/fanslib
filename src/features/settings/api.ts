import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, SettingsHandlers } from "./api-type";
import { importDatabase, validateImportedDatabase } from "./import";
import { loadSettings } from "./load";
import { resetDatabase } from "./reset";
import { saveSettings } from "./save";
import {
  clearFanslyCredentials,
  loadFanslyCredentials,
  saveFanslyCredentials,
} from "./secure-storage";
import { toggleSfwMode } from "./toggle-sfw-mode";

export const handlers: SettingsHandlers = {
  load: (_: any) => loadSettings(),
  save: (_: any, settings) => saveSettings(settings),
  resetDatabase: () => resetDatabase(),
  saveFanslyCredentials: (_: any, credentials) => saveFanslyCredentials(credentials),
  loadFanslyCredentials: (_: any) => loadFanslyCredentials(),
  clearFanslyCredentials: (_: any) => clearFanslyCredentials(),
  importDatabase: (_: any, sourcePath: string) => importDatabase(sourcePath),
  validateImportedDatabase: (_: any, libraryPath: string) => validateImportedDatabase(libraryPath),
  toggleSfwMode: (_: any) => toggleSfwMode(),
};

export const settingsHandlers = prefixNamespaceObject(namespace, handlers);
