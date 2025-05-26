import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { MediaTag, TagDefinition, TagDimension } from "./entity";

export type CreateTagDimensionDto = {
  name: string;
  description?: string;
  dataType: "categorical" | "numerical" | "boolean";
  validationSchema?: string;
  sortOrder?: number;
};

export type UpdateTagDimensionDto = {
  name?: string;
  description?: string;
  validationSchema?: string;
  sortOrder?: number;
};

export type CreateTagDefinitionDto = {
  dimensionId: number;
  value: string;
  displayName: string;
  description?: string;
  metadata?: string;
  parentTagId?: number;
};

export type UpdateTagDefinitionDto = {
  value?: string;
  displayName?: string;
  description?: string;
  metadata?: string;
  parentTagId?: number;
};

export type AssignTagsDto = {
  mediaId: string;
  tagDefinitionIds: number[];
  source: "manual" | "automated" | "imported";
  confidence?: number;
};

const methods = [
  // Dimension Management
  "createDimension",
  "updateDimension",
  "deleteDimension",
  "getAllDimensions",
  "getDimensionById",

  // Tag Definition Management
  "createTag",
  "updateTag",
  "deleteTag",
  "getTagsByDimension",
  "getTagById",

  // Media Tagging
  "assignTagsToMedia",
  "removeTagsFromMedia",
  "getMediaTags",
  "bulkAssignTags",

  // Tag Suggestions
  "getRecommendedTags",
] as const;

export type TagHandlers = {
  // Dimension Management
  createDimension: (_: any, dto: CreateTagDimensionDto) => Promise<TagDimension>;
  updateDimension: (_: any, id: number, dto: UpdateTagDimensionDto) => Promise<TagDimension>;
  deleteDimension: (_: any, id: number) => Promise<void>;
  getAllDimensions: (_: any) => Promise<TagDimension[]>;
  getDimensionById: (_: any, id: number) => Promise<TagDimension>;

  // Tag Definition Management
  createTag: (_: any, dto: CreateTagDefinitionDto) => Promise<TagDefinition>;
  updateTag: (_: any, id: number, dto: UpdateTagDefinitionDto) => Promise<TagDefinition>;
  deleteTag: (_: any, id: number) => Promise<void>;
  getTagsByDimension: (_: any, dimensionId: number) => Promise<TagDefinition[]>;
  getTagById: (_: any, id: number) => Promise<TagDefinition>;

  // Media Tagging
  assignTagsToMedia: (_: any, dto: AssignTagsDto) => Promise<MediaTag[]>;
  removeTagsFromMedia: (_: any, mediaId: string, tagIds: number[]) => Promise<void>;
  getMediaTags: (_: any, mediaId: string, dimensionId?: number) => Promise<MediaTag[]>;
  bulkAssignTags: (_: any, assignments: AssignTagsDto[]) => Promise<MediaTag[]>;

  // Tag Suggestions
  getRecommendedTags: (_: any, mediaId: string) => Promise<TagDefinition[]>;
};

export const namespace = "tags" as const;
export const tagMethods = methods.map((m) => prefixNamespace(namespace, m));
export type TagIpcChannel = keyof PrefixNamespace<TagHandlers, typeof namespace>;
export type TagIpcHandlers = {
  [K in TagIpcChannel]: TagHandlers[StripNamespace<K, typeof namespace>];
};
