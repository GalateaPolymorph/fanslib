import { prefixNamespaceObject } from "../../lib/namespace";
import { CategoryHandlers, namespace } from "./api-type";
import { createCategory, deleteCategory, fetchAllCategories, updateCategory } from "./operations";

const handlers: CategoryHandlers = {
  create: async (_, name) => createCategory(name),
  getAll: async () => fetchAllCategories(),
  update: async (_, id, updates) => updateCategory(id, updates),
  delete: async (_, id) => deleteCategory(id),
};

export const categoryHandlers = prefixNamespaceObject(namespace, handlers);
