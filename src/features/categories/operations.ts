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
  slug: string,
  updates: Partial<Category>
): Promise<Category | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Category);

  await repository.update({ slug }, updates);
  return repository.findOneBy({ slug });
};

export const deleteCategory = async (slug: string): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Category);
  await repository.delete({ slug });
};
