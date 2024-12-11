import { app } from "electron";
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import { DataSource } from "typeorm";
import { Category } from "../features/categories/entity";
import { Channel, ChannelType } from "../features/channels/entity";
import { ContentSchedule } from "../features/content-schedules/entity";
import { Media } from "../features/library/entity";
import { Post, PostMedia } from "../features/posts/entity";

const dbPath = join(app.getPath("userData"), "fanslib.sqlite");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: dbPath,
  entities: [Category, Channel, ChannelType, Media, Post, PostMedia, ContentSchedule],
  synchronize: true,
  logging: false,
});

let initialized = false;

export const uninitialize = async () => {
  if (initialized) {
    await AppDataSource.destroy();
    initialized = false;
  }
};
export const db = async () => {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
  }
  return AppDataSource;
};

export const resetDatabase = async (): Promise<void> => {
  console.log("🗑️ Resetting database...");
  try {
    const dataSource = await db();
    await dataSource.destroy();
    initialized = false;

    if (existsSync(dbPath)) {
      await unlink(dbPath);
    }

    await db();
    console.log("✅ Database reset successfully");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
};
