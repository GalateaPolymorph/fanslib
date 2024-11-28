import { categoriesDb } from "./base";

export const deleteCategory = async (slug: string): Promise<void> => {
  const database = await categoriesDb();
  return new Promise((resolve, reject) => {
    database.remove({ slug }, {}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
