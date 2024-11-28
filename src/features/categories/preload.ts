import { ipcRenderer } from "electron";

export const categoryBridge = {
  createCategory: (name: string) => ipcRenderer.invoke("category:create-category", name),
  getAllCategories: () => ipcRenderer.invoke("category:get-categories"),
  deleteCategory: (slug: string) => ipcRenderer.invoke("category:delete-category", slug),
  updateCategory: (slug: string, updates: { color?: string }) =>
    ipcRenderer.invoke("category:update-category", slug, updates),
};
