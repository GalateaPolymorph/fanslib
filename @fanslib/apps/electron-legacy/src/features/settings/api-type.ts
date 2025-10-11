import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Settings } from "./entity";

type FanslyCredentials = {
  fanslyAuth?: string;
  fanslySessionId?: string;
  fanslyClientCheck?: string;
  fanslyClientId?: string;
};

export type DatabaseImportResult = {
  success: boolean;
  error?: string;
};

export type ValidationResult = {
  totalFiles: number;
  missingFiles: string[];
  validFiles: number;
};

export type HealthCheckResult = {
  status: "healthy" | "unhealthy" | "error";
  message?: string;
  timestamp?: string;
  uptime?: number;
};

const methods = [
  "load",
  "save",
  "resetDatabase",
  "saveFanslyCredentials",
  "loadFanslyCredentials",
  "clearFanslyCredentials",
  "importDatabase",
  "validateImportedDatabase",
  "toggleSfwMode",
  "healthCheck",
] as const;
export type SettingsHandlers = {
  load: (_: any) => Promise<Settings>;
  save: (_: any, settings: Partial<Settings>) => Promise<Settings>;
  resetDatabase: (_: any) => Promise<void>;
  saveFanslyCredentials: (_: any, credentials: Partial<FanslyCredentials>) => Promise<void>;
  loadFanslyCredentials: (_: any) => Promise<FanslyCredentials>;
  clearFanslyCredentials: (_: any) => Promise<void>;
  importDatabase: (_: any, sourcePath: string) => Promise<DatabaseImportResult>;
  validateImportedDatabase: (_: any, libraryPath: string) => Promise<ValidationResult>;
  toggleSfwMode: (_: any) => Promise<Settings>;
  healthCheck: (_: any, serverUrl: string) => Promise<HealthCheckResult>;
};

export const namespace = "settings" as const;
export const settingsMethods = methods.map((m) => prefixNamespace(namespace, m));
export type SettingsIpcChannel = keyof PrefixNamespace<SettingsHandlers, typeof namespace>;
export type SettingsIpcHandlers = {
  [K in SettingsIpcChannel]: SettingsHandlers[StripNamespace<K, typeof namespace>];
};
