import { db } from "../../lib/db";
import { slugify } from "../../lib/slugify";
import { getRandomColor } from "./colors";
import { Category } from "./entity";

export const createCategory = async (name: string): Promise<Category> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Category);

  const category = new Category();
  category.name = name;
  category.slug = slugify(name);
  category.color = getRandomColor();

  return repository.save(category);
};

export const fetchCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Category);
  return repository.findOneBy({ slug });
};

export const fetchAllCategories = async (): Promise<Category[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Category);
  return repository.find();
};

export const updateCategory = async (
  id: string,
  updates: Partial<Category>
): Promise<Category | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Category);

  const category = await repository.findOneBy({ id });
  if (!category) return null;

  // Apply updates
  Object.assign(category, updates);

  // Save the entity
  return repository.save(category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Category);
  await repository.delete({ id });
};
