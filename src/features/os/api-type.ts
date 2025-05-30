import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";

const methods = ["revealInFinder", "copyToClipboard"] as const;
export type OsHandlers = {
  revealInFinder: (_: any, path: string) => void;
  copyToClipboard: (_: any, text: string) => void;
};

export const namespace = "os" as const;
export const osMethods = methods.map((m) => prefixNamespace(namespace, m));
export type OsIpcChannel = keyof PrefixNamespace<OsHandlers, typeof namespace>;
export type OsIpcHandlers = {
  [K in OsIpcChannel]: OsHandlers[StripNamespace<K, typeof namespace>];
};
