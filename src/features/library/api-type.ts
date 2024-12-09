import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Media } from "./entity";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface MediaFilters {
  categories?: string[]; // category slugs
}

export interface GetAllMediaParams extends Partial<PaginationParams> {
  filters?: MediaFilters;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LibraryScanResult {
  added: number;
  updated: number;
  removed: number;
  total: number;
}

export interface FileScanResult {
  action: "added" | "updated" | "unchanged";
  media: Media;
}

const methods = ["scan", "scanFile", "getAll", "update", "get"] as const;
export type LibraryHandlers = {
  scan: (_: unknown) => Promise<LibraryScanResult>;
  scanFile: (_: unknown, path: string) => Promise<FileScanResult>;
  get: (_: unknown, id: string) => Promise<Media | null>;
  getAll: (_: unknown, params?: GetAllMediaParams) => Promise<PaginatedResponse<Media>>;
  update: (
    _: unknown,
    id: string,
    updates: Partial<Media> & { categoryIds?: string[] }
  ) => Promise<Media | null>;
};

export const namespace = "library" as const;
export const libraryMethods = methods.map((m) => prefixNamespace(namespace, m));
export type LibraryIpcChannel = keyof PrefixNamespace<LibraryHandlers, typeof namespace>;
export type LibraryIpcHandlers = {
  [K in LibraryIpcChannel]: LibraryHandlers[StripNamespace<K, typeof namespace>];
};
