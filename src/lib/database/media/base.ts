import { app } from "electron";
import { existsSync } from "fs";
import { unlink, writeFile } from "fs/promises";
import Datastore from "nedb";
import { join } from "path";

let mediaDatastore: Datastore | null;
const dbPath = join(app.getPath("userData"), "media.db");

export const mediaDb = async () => {
  if (mediaDatastore) return mediaDatastore;

  mediaDatastore = new Datastore({ filename: dbPath, autoload: true });
  mediaDatastore.ensureIndex({ fieldName: "path", unique: true });

  return mediaDatastore;
};

export const resetMediaDatabase = async (): Promise<void> => {
  console.log("🗑️ Resetting media database...");
  try {
    mediaDatastore = null;

    if (existsSync(dbPath)) {
      await unlink(dbPath);
    }

    await writeFile(dbPath, "", { flag: "w" });
    await mediaDb();

    console.log("✅ Media database reset successfully");
  } catch (error) {
    console.error("❌ Error resetting media database:", error);
    throw error;
  }
};
