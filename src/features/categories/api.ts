import { prefixNamespaceObject } from "../../lib/namespace";
import { CategoryHandlers, namespace } from "./api-type";
import { createCategory, deleteCategory, fetchAllCategories, updateCategory } from "./operations";

const handlers: CategoryHandlers = {
  create: async (_, name) => createCategory(name),
  getAll: async () => fetchAllCategories(),
  update: async (_, slug, updates) => updateCategory(slug, updates),
  delete: async (_, slug) => deleteCategory(slug),
};

export const categoryHandlers = prefixNamespaceObject(namespace, handlers);
