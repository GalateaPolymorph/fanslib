import { app } from "electron";
import { existsSync } from "fs";
import { unlink, writeFile } from "fs/promises";
import Datastore from "nedb";
import { join } from "path";

let categoriesDatastore: Datastore | null;
const dbPath = join(app.getPath("userData"), "categories.db");

export const categoriesDb = async () => {
  if (categoriesDatastore) return categoriesDatastore;
  categoriesDatastore = new Datastore({ filename: dbPath, autoload: true });
  categoriesDatastore.ensureIndex({ fieldName: "slug", unique: true });
  return categoriesDatastore;
};

export const resetCategoriesDatabase = async (): Promise<void> => {
  console.log("🗑️ Resetting categories database...");
  try {
    categoriesDatastore = null;

    if (existsSync(dbPath)) {
      await unlink(dbPath);
    }

    await writeFile(dbPath, "", { flag: "w" });

    categoriesDatastore = new Datastore({ filename: dbPath, autoload: true });
    categoriesDatastore.ensureIndex({ fieldName: "slug", unique: true });

    console.log("✅ Categories database reset successfully");
  } catch (error) {
    console.error("❌ Error resetting categories database:", error);
    throw error;
  }
};
