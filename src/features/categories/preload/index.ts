import { ipcRenderer } from "electron";
import { CategoriesAPI } from "../types";

export const categoriesBridge: CategoriesAPI = {
  getAllCategories: () => ipcRenderer.invoke("category:get-categories"),
  createCategory: (data) => ipcRenderer.invoke("category:create-category", data),
  updateCategory: (slug, updates) => ipcRenderer.invoke("category:update-category", slug, updates),
  deleteCategory: (slug) => ipcRenderer.invoke("category:delete-category", slug),
};
