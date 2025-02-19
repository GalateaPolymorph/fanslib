import { prefixNamespaceObject } from "../../lib/namespace";
import { loadSettings } from "../settings/load";
import { LibraryHandlers, namespace } from "./api-type";
import {
  assignTierToMedia,
  assignTierToMedias,
  deleteMedia,
  fetchAllMedia,
  getMediaById,
  updateMedia,
  updateMediaNiches,
} from "./operations";
import { scanFile, scanLibrary } from "./scan";

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

  updateNiches: async (_, mediaId: string, nicheIds: number[]) => {
    return updateMediaNiches(mediaId, nicheIds);
  },

  assignTierToMedia: async (_, mediaId: string, tierId: number) => {
    return assignTierToMedia(mediaId, tierId);
  },

  assignTierToMedias: async (_, mediaIds: string[], tierId: number) => {
    return assignTierToMedias(mediaIds, tierId);
  },

  onScanProgress: (_) => {
    // Stub
  },

  onScanComplete: (_) => {
    //Stub
  },
};

export const libraryHandlers = prefixNamespaceObject(namespace, handlers);
