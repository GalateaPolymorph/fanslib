import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, SettingsHandlers } from "./api-type";
import { loadSettings } from "./load";
import { resetDatabase } from "./reset";
import { saveSettings } from "./save";

export const handlers: SettingsHandlers = {
  load: (_: any) => loadSettings(),
  save: (_: any, settings) => saveSettings(settings),
  resetDatabase: () => resetDatabase(),
};

export const settingsHandlers = prefixNamespaceObject(namespace, handlers);
