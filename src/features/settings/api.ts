import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, SettingsHandlers } from "./api-type";
import { loadSettings } from "./load";
import { resetDatabase } from "./reset";
import { saveSettings } from "./save";
import {
  clearFanslyCredentials,
  loadFanslyCredentials,
  saveFanslyCredentials,
} from "./secure-storage";

export const handlers: SettingsHandlers = {
  load: (_: any) => loadSettings(),
  save: (_: any, settings) => saveSettings(settings),
  resetDatabase: () => resetDatabase(),
  saveFanslyCredentials: (_: any, credentials) => saveFanslyCredentials(credentials),
  loadFanslyCredentials: (_: any) => loadFanslyCredentials(),
  clearFanslyCredentials: (_: any) => clearFanslyCredentials(),
};

export const settingsHandlers = prefixNamespaceObject(namespace, handlers);
