import { prefixNamespaceObject } from "../../lib/namespace";
import { TierHandlers, namespace } from "./api-type";
import { createTier, deleteTier, getTier, getTiers, updateTier } from "./operations";

const handlers: TierHandlers = {
  create: (_, dto) => createTier(dto),
  update: (_, id, dto) => updateTier(id, dto),
  delete: (_, id) => deleteTier(id),
  getAll: () => getTiers(),
  getById: (_, id) => getTier(id),
};

export const tierHandlers = prefixNamespaceObject(namespace, handlers);
