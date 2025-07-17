import { app } from "electron";
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import { DataSource } from "typeorm";
import {
  AnalyticsFetchHistory,
  FanslyAnalyticsAggregate,
  FanslyAnalyticsDatapoint,
} from "../features/analytics/entity";
import { Channel, ChannelType } from "../features/channels/entity";
import { Subreddit } from "../features/channels/subreddit";
import { ContentSchedule } from "../features/content-schedules/entity";
import { FilterPreset } from "../features/filter-presets/entity";
import { Hashtag, HashtagChannelStats } from "../features/hashtags/entity";
import { Media } from "../features/library/entity";
import { Post, PostMedia } from "../features/posts/entity";
import { Shoot } from "../features/shoots/entity";
import { CaptionSnippet } from "../features/snippets/entity";
import { startPeriodicCleanup, stopPeriodicCleanup } from "../features/tags/drift-prevention";
import { MediaTag, TagDefinition, TagDimension } from "../features/tags/entity";
import { isDevelopmentMode } from "./development-mode";

const getDatabasePath = () => {
  const userDataPath = app.getPath("userData");
  const dbFileName = isDevelopmentMode() ? "fanslib-dev.sqlite" : "fanslib.sqlite";
  return join(userDataPath, dbFileName);
};

const dbPath = getDatabasePath();

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: dbPath,
  entities: [
    Channel,
    ChannelType,
    Hashtag,
    HashtagChannelStats,
    Media,
    Post,
    PostMedia,
    ContentSchedule,
    Shoot,
    Subreddit,
    FanslyAnalyticsDatapoint,
    FanslyAnalyticsAggregate,
    AnalyticsFetchHistory,
    TagDimension,
    TagDefinition,
    MediaTag,
    FilterPreset,
    CaptionSnippet,
  ],
  synchronize: true,
  logging: false,
});

let initialized = false;

export const uninitialize = async () => {
  if (initialized) {
    await AppDataSource.destroy();
    initialized = false;
    stopPeriodicCleanup();
  }
};

export const db = async () => {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;

    startPeriodicCleanup();
  }

  return AppDataSource;
};

export const resetDatabase = async (): Promise<void> => {
  console.log("🗑️ Resetting database...");
  try {
    const dataSource = await db();
    await dataSource.destroy();
    initialized = false;

    const currentDbPath = getDatabasePath();
    if (existsSync(currentDbPath)) {
      await unlink(currentDbPath);
    }

    await db();
    console.log("✅ Database reset successfully");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
};

export const resetDevelopmentDatabase = async (): Promise<void> => {
  if (process.env.DEVELOPMENT_MODE !== "true") {
    throw new Error("Development database reset can only be used in development mode");
  }

  console.log("🗑️ Resetting development database...");
  try {
    const dataSource = await db();
    await dataSource.destroy();
    initialized = false;

    const devDbPath = getDatabasePath();
    if (existsSync(devDbPath)) {
      await unlink(devDbPath);
    }

    // Re-initialize database and load fixtures
    await db();
    const { loadAllFixtures } = await import("../fixtures");
    await loadAllFixtures();

    console.log("✅ Development database reset and fixtures loaded successfully");
  } catch (error) {
    console.error("❌ Error resetting development database:", error);
    throw error;
  }
};
