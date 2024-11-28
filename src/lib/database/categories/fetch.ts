import { categoriesDb } from "./base";
import { Category } from "./type";

export const fetchCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const database = await categoriesDb();
  return new Promise((resolve, reject) => {
    database.findOne({ slug }, (err: Error | null, doc: Category | null) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

export const fetchAllCategories = async (): Promise<Category[]> => {
  const database = await categoriesDb();
  return new Promise((resolve, reject) => {
    database.find({}, (err: Error | null, docs: Category[]) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
};
