import { prefixNamespaceObject } from "../../lib/namespace";
import { TagHandlers, namespace } from "./api-type";
import { createTag, deleteTag, getTag, getTags, updateTag } from "./operations";

const handlers: TagHandlers = {
  create: (_, dto) => createTag(dto),
  update: (_, id, dto) => updateTag(id, dto),
  delete: (_, id) => deleteTag(id),
  getAll: () => getTags(),
  getById: (_, id) => getTag(id),
};

export const tagHandlers = prefixNamespaceObject(namespace, handlers);
