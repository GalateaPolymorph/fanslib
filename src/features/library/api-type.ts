import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { PaginatedResponse, PaginationParams } from "../_common/pagination";
import { Media } from "./entity";

export type SortField = "fileModificationDate" | "fileCreationDate" | "lastPosted" | "random";
export type SortDirection = "ASC" | "DESC";

export type MediaSort = {
  field: SortField;
  direction: SortDirection;
};

export type FilterItem =
  | {
      type: "channel" | "subreddit" | "tag" | "shoot";
      id: string;
    }
  | {
      type: "filename" | "caption";
      value: string;
    }
  | {
      type: "posted";
      value: boolean;
    }
  | {
      type: "createdDateStart" | "createdDateEnd";
      value: Date;
    };

export type FilterGroup = {
  include: boolean;
  items: FilterItem[];
};

export type MediaFilters = FilterGroup[];

// DEPRECATED: Use MediaFilters instead
export type TagFilter = {
  tagIds?: number[];
};

export type GetAllMediaParams = Partial<
  PaginationParams & { filters: MediaFilters; sort?: MediaSort }
>;

export type LibraryScanResult = {
  added: number;
  updated: number;
  removed: number;
  total: number;
};

export type LibraryScanProgress = {
  current: number;
  total: number;
};

export type FileScanResult = {
  action: "added" | "updated" | "unchanged";
  media: Media;
};

export type UpdateMediaPayload = Partial<
  Omit<Media, "id" | "createdAt" | "updatedAt" | "postMedia">
>;

const methods = [
  "scan",
  "scanFile",
  "getAll",
  "get",
  "update",
  "delete",
  "onScanProgress",
  "onScanComplete",
] as const;

export type LibraryHandlers = {
  scan: (_: unknown) => Promise<LibraryScanResult>;
  scanFile: (_: unknown, path: string) => Promise<FileScanResult>;
  get: (_: unknown, id: string) => Promise<Media | null>;
  getAll: (_: unknown, params?: GetAllMediaParams) => Promise<PaginatedResponse<Media>>;
  update: (_: unknown, id: string, updates: UpdateMediaPayload) => Promise<Media | null>;
  delete: (_: unknown, id: string, deleteFile?: boolean) => Promise<void>;
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
