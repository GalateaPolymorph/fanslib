import { slugify } from "../../utils/slugify";
import { categoriesDb } from "./base";
import { getRandomColor } from "./colors";
import { Category } from "./type";

export const createCategory = async (name: string): Promise<Category> => {
  const database = await categoriesDb();

  const slug = slugify(name);
  const color = getRandomColor();

  return new Promise((resolve, reject) => {
    database.insert({ name, slug, color }, (err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};
