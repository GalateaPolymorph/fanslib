import { Category } from "../../lib/database/categories/type";

export interface CategoriesAPI {
  /**
   * Get all categories
   */
  getAllCategories: () => Promise<Category[]>;

  /**
   * Create a new category
   * @param data Category data
   */
  createCategory: (data: Pick<Category, "name" | "slug">) => Promise<Category>;

  /**
   * Update a category
   * @param slug Category slug
   * @param updates Updates to apply
   */
  updateCategory: (slug: string, updates: Partial<Pick<Category, "name">>) => Promise<Category>;

  /**
   * Delete a category
   * @param slug Category slug
   */
  deleteCategory: (slug: string) => Promise<void>;
}
