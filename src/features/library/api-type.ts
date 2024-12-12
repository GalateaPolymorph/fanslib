import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Media } from "./entity";

export interface PaginationParams {
  page: number;
  limit: number;
}

export type SortField = "fileModificationDate" | "fileCreationDate" | "lastPosted";
export type SortDirection = "ASC" | "DESC";

export interface MediaSort {
  field: SortField;
  direction: SortDirection;
}

export interface MediaFilters {
  categories?: string[]; // category slugs
  unposted?: boolean;
}

export type GetAllMediaParams = Partial<PaginationParams & MediaFilters & { sort?: MediaSort }>;

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

export type LibraryScanProgress = {
  current: number;
  total: number;
};

export interface FileScanResult {
  action: "added" | "updated" | "unchanged";
  media: Media;
}

export type UpdateMediaPayload = Partial<
  Omit<Media, "id" | "createdAt" | "updatedAt" | "categories" | "postMedia">
> & { categoryIds?: string[] };

const methods = [
  "scan",
  "scanFile",
  "getAll",
  "update",
  "get",
  "onScanProgress",
  "onScanComplete",
] as const;
export type LibraryHandlers = {
  scan: (_: unknown) => Promise<LibraryScanResult>;
  scanFile: (_: unknown, path: string) => Promise<FileScanResult>;
  get: (_: unknown, id: string) => Promise<Media | null>;
  getAll: (_: unknown, params?: GetAllMediaParams) => Promise<PaginatedResponse<Media>>;
  update: (_: unknown, id: string, updates: UpdateMediaPayload) => Promise<Media | null>;
  onScanProgress: (
    _: unknown,
    listener: (_: unknown, progress: LibraryScanProgress) => void
  ) => void;
  onScanComplete: (_: unknown, listener: (_: unknown, result: LibraryScanResult) => void) => void;
};

export const namespace = "library" as const;
export const libraryMethods = methods.map((m) => prefixNamespace(namespace, m));
export type LibraryIpcChannel = keyof PrefixNamespace<LibraryHandlers, typeof namespace>;
export type LibraryIpcHandlers = {
  [K in LibraryIpcChannel]: LibraryHandlers[StripNamespace<K, typeof namespace>];
};
