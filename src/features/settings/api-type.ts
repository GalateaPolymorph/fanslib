import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Settings } from "./entity";

const methods = ["load", "save"] as const;
export type SettingsHandlers = {
  load: (_: any) => Promise<Settings>;
  save: (_: any, settings: Partial<Settings>) => Promise<Settings>;
};

export const namespace = "settings" as const;
export const settingsMethods = methods.map((m) => prefixNamespace(namespace, m));
export type SettingsIpcChannel = keyof PrefixNamespace<SettingsHandlers, typeof namespace>;
export type SettingsIpcHandlers = {
  [K in SettingsIpcChannel]: SettingsHandlers[StripNamespace<K, typeof namespace>];
};
