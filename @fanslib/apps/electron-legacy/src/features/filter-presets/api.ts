import { prefixNamespaceObject } from "../../lib/namespace";
import { FilterPresetHandlers, namespace } from "./api-type";
import {
  createFilterPreset,
  deleteFilterPreset,
  getAllFilterPresets,
  getValidatedFilterPreset,
  updateFilterPreset,
} from "./operations";

const handlers: FilterPresetHandlers = {
  getAll: async () => getAllFilterPresets(),
  get: async (_, id) => getValidatedFilterPreset(id),
  create: async (_, payload) => createFilterPreset(payload),
  update: async (_, id, payload) => updateFilterPreset(id, payload),
  delete: async (_, id) => deleteFilterPreset(id),
};

export const filterPresetHandlers = prefixNamespaceObject(namespace, handlers);
