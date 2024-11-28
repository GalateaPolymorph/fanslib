import { ipcMain } from "electron";
import { createCategory } from "../../lib/database/categories/create";
import { deleteCategory } from "../../lib/database/categories/delete";
import { fetchAllCategories } from "../../lib/database/categories/fetch";
import { updateCategory } from "../../lib/database/categories/update";

export const registerCategoryHandlers = () => {
  ipcMain.handle("category:create-category", async (_event, name: string) => {
    return createCategory(name);
  });

  ipcMain.handle("category:get-categories", async () => {
    return fetchAllCategories();
  });

  ipcMain.handle("category:delete-category", async (_event, slug: string) => {
    return deleteCategory(slug);
  });

  ipcMain.handle(
    "category:update-category",
    async (_event, slug: string, updates: { color?: string }) => {
      return updateCategory(slug, updates);
    }
  );
};
