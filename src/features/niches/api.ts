import { prefixNamespaceObject } from "../../lib/namespace";
import { NicheHandlers, namespace } from "./api-type";
import { createNiche, deleteNiche, getNiche, getNiches, updateNiche } from "./operations";

const handlers: NicheHandlers = {
  create: (_, dto) => createNiche(dto),
  update: (_, id, dto) => updateNiche(id, dto),
  delete: (_, id) => deleteNiche(id),
  getAll: () => getNiches(),
  getById: (_, id) => getNiche(id),
};

export const nicheHandlers = prefixNamespaceObject(namespace, handlers);
