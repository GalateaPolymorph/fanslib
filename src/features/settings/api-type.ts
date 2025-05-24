import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Settings } from "./entity";

type FanslyCredentials = {
  fanslyAuth?: string;
  fanslySessionId?: string;
  fanslyClientCheck?: string;
  fanslyClientId?: string;
};

const methods = [
  "load",
  "save",
  "resetDatabase",
  "saveFanslyCredentials",
  "loadFanslyCredentials",
  "clearFanslyCredentials",
] as const;
export type SettingsHandlers = {
  load: (_: any) => Promise<Settings>;
  save: (_: any, settings: Partial<Settings>) => Promise<Settings>;
  resetDatabase: (_: any) => Promise<void>;
  saveFanslyCredentials: (_: any, credentials: Partial<FanslyCredentials>) => Promise<void>;
  loadFanslyCredentials: (_: any) => Promise<FanslyCredentials>;
  clearFanslyCredentials: (_: any) => Promise<void>;
};

export const namespace = "settings" as const;
export const settingsMethods = methods.map((m) => prefixNamespace(namespace, m));
export type SettingsIpcChannel = keyof PrefixNamespace<SettingsHandlers, typeof namespace>;
export type SettingsIpcHandlers = {
  [K in SettingsIpcChannel]: SettingsHandlers[StripNamespace<K, typeof namespace>];
};
