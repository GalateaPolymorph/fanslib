import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Media } from "./entity";

const methods = ["scan", "getAll", "update", "onLibraryChanged", "offLibraryChanged"] as const;
export type LibraryHandlers = {
  scan: (_: any) => Promise<Media[]>;
  getAll: (_: any) => Promise<Media[]>;
  update: (_: any, path: string, updates: Partial<Media>) => Promise<void>;
  onLibraryChanged: (_: any, callback: (media: Media[]) => void) => void;
  offLibraryChanged: (_: any, callback: (media: Media[]) => void) => void;
};

export const namespace = "library" as const;
export const libraryMethods = methods.map((m) => prefixNamespace(namespace, m));
export type LibraryIpcChannel = keyof PrefixNamespace<LibraryHandlers, typeof namespace>;
export type LibraryIpcHandlers = {
  [K in LibraryIpcChannel]: LibraryHandlers[StripNamespace<K, typeof namespace>];
};
