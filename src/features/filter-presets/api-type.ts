import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { MediaFilters } from "../library/api-type";
import { FilterPreset } from "./entity";

export type CreateFilterPresetPayload = {
  name: string;
  filters: MediaFilters;
};

export type UpdateFilterPresetPayload = {
  name?: string;
  filters?: MediaFilters;
};

const methods = ["getAll", "get", "create", "update", "delete"] as const;

export type FilterPresetHandlers = {
  getAll: (_: unknown) => Promise<FilterPreset[]>;
  get: (_: unknown, id: string) => Promise<FilterPreset | null>;
  create: (_: unknown, payload: CreateFilterPresetPayload) => Promise<FilterPreset>;
  update: (
    _: unknown,
    id: string,
    payload: UpdateFilterPresetPayload
  ) => Promise<FilterPreset | null>;
  delete: (_: unknown, id: string) => Promise<void>;
};

export const namespace = "filterPresets" as const;
export const filterPresetMethods = methods.map((m) => prefixNamespace(namespace, m));
export type FilterPresetIpcChannel = keyof PrefixNamespace<FilterPresetHandlers, typeof namespace>;
export type FilterPresetIpcHandlers = {
  [K in FilterPresetIpcChannel]: FilterPresetHandlers[StripNamespace<K, typeof namespace>];
};
