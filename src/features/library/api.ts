import { prefixNamespaceObject } from "../../lib/namespace";
import { loadSettings } from "../settings/load";
import { LibraryHandlers, namespace } from "./api-type";
import {
  deleteMedia,
  fetchAllMedia,
  findAdjacentMedia,
  getMediaById,
  updateMedia,
} from "./operations";
import { scanFile, scanLibrary } from "./scan";

// Export filter helper functions for use throughout the application
export * from "./filter-helpers";

export const handlers: LibraryHandlers = {
  scan: async () => {
    const settings = await loadSettings();
    if (!settings?.libraryPath) {
      throw new Error("Library path not set");
    }
    return scanLibrary(settings.libraryPath);
  },

  scanFile: async (_, path: string) => {
    return scanFile(path);
  },

  getAll: async (_, params) => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;
    return fetchAllMedia({ page, limit, ...params });
  },

  get: async (_, id: string) => {
    return getMediaById(id);
  },

  update: async (_, id: string, updates) => {
    return updateMedia(id, updates);
  },

  delete: async (_, id: string, deleteFile = false) => {
    return deleteMedia(id, deleteFile);
  },

  adjacentMedia: async (_, mediaId: string, params) => {
    return findAdjacentMedia(mediaId, params);
  },

  onScanProgress: (_) => {
    // Stub
  },

  onScanComplete: (_) => {
    //Stub
  },
};

export const libraryHandlers = prefixNamespaceObject(namespace, handlers);
