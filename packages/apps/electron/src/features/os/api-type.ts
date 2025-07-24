import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";

export type ShowOpenDialogResult = {
  canceled: boolean;
  filePaths: string[];
};

export type ShowOpenDialogOptions = {
  title?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: Array<"openFile" | "openDirectory" | "multiSelections">;
};

const methods = ["revealInFinder", "copyToClipboard", "startDrag", "showOpenDialog"] as const;
export type OsHandlers = {
  revealInFinder: (_: any, path: string) => void;
  copyToClipboard: (_: any, text: string) => void;
  startDrag: (_: any, filePaths: string[]) => void;
  showOpenDialog: (_: any, options: ShowOpenDialogOptions) => Promise<ShowOpenDialogResult>;
};

export const namespace = "os" as const;
export const osMethods = methods.map((m) => prefixNamespace(namespace, m));
export type OsIpcChannel = keyof PrefixNamespace<OsHandlers, typeof namespace>;
export type OsIpcHandlers = {
  [K in OsIpcChannel]: OsHandlers[StripNamespace<K, typeof namespace>];
};
