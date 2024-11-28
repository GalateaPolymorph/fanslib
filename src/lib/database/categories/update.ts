import { categoriesDb } from "./base";
import { Category } from "./type";

export const updateCategory = async (
  slug: string,
  updates: Partial<Omit<Category, "slug">>
): Promise<Category | null> => {
  const database = await categoriesDb();
  return new Promise((resolve, reject) => {
    database.update(
      { slug },
      { $set: updates },
      { returnUpdatedDocs: true },
      (err, _numAffected, affectedDocuments, _upserted) => {
        if (err) reject(err);
        else resolve(affectedDocuments);
      }
    );
  });
};
