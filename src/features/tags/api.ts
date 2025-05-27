import { prefixNamespaceObject } from "../../lib/namespace";
import { TagHandlers, namespace } from "./api-type";
import {
  assignTagsToMedia,
  bulkAssignTags,
  createTagDefinition,
  createTagDimension,
  deleteTagDefinition,
  deleteTagDimension,
  getAllTagDimensions,
  getMediaTags,
  getTagDefinitionById,
  getTagDimensionById,
  getTagsByDimension,
  removeTagsFromMedia,
  updateTagDefinition,
  updateTagDimension,
} from "./operations";

export const handlers: TagHandlers = {
  // Dimension Management
  createDimension: (_, dto) => {
    return createTagDimension(dto);
  },
  updateDimension: (_, id, dto) => {
    return updateTagDimension(id, dto);
  },
  deleteDimension: (_, id) => {
    return deleteTagDimension(id);
  },
  getAllDimensions: (_) => {
    return getAllTagDimensions();
  },
  getDimensionById: (_, id) => {
    return getTagDimensionById(id);
  },

  // Tag Definition Management
  createTag: (_, dto) => {
    return createTagDefinition(dto);
  },
  updateTag: (_, id, dto) => {
    return updateTagDefinition(id, dto);
  },
  deleteTag: (_, id) => {
    return deleteTagDefinition(id);
  },
  getTagsByDimension: (_, dimensionId) => {
    return getTagsByDimension(dimensionId);
  },
  getTagById: (_, id) => {
    return getTagDefinitionById(id);
  },

  // Media Tagging
  assignTagsToMedia: (_, dto) => {
    return assignTagsToMedia(dto);
  },
  removeTagsFromMedia: (_, mediaId, tagIds) => {
    return removeTagsFromMedia(mediaId, tagIds);
  },
  getMediaTags: (_, mediaId, dimensionId) => {
    return getMediaTags(mediaId, dimensionId);
  },
  bulkAssignTags: (_, assignments) => {
    return bulkAssignTags(assignments);
  },
};

export const tagHandlers = prefixNamespaceObject(namespace, handlers);
