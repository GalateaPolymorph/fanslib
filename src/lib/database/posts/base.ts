import { app } from "electron";
import { existsSync } from "fs";
import { unlink, writeFile } from "fs/promises";
import Datastore from "nedb";
import { join } from "path";
import { RawPost } from "./type";

let postsDatastore: Datastore | null;

const postsDbPath = join(app.getPath("userData"), "posts.db");

export const postsDb = async () => {
  if (postsDatastore) return postsDatastore;
  postsDatastore = new Datastore({ filename: postsDbPath, autoload: true });
  postsDatastore.ensureIndex({ fieldName: "id", unique: true });
  return postsDatastore;
};

export const resetPostsDatabase = async (): Promise<void> => {
  console.log("🗑️ Resetting posts database...");
  try {
    postsDatastore = null;

    if (existsSync(postsDbPath)) {
      await unlink(postsDbPath);
    }

    await writeFile(postsDbPath, "", { flag: "w" });

    postsDatastore = new Datastore({ filename: postsDbPath, autoload: true });
    postsDatastore.ensureIndex({ fieldName: "id", unique: true });

    console.log("✅ Posts database reset successfully");
  } catch (error) {
    console.error("❌ Error resetting posts database:", error);
    throw error;
  }
};

export const addMetadataToPost = (post: Partial<RawPost>): RawPost => {
  const now = new Date().toISOString();
  return {
    ...post,
    createdAt: post.createdAt || now,
    updatedAt: now,
  } as RawPost;
};
