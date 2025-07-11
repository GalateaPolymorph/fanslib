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
import { startPeriodicCleanup, stopPeriodicCleanup } from "../features/tags/drift-prevention";
import { MediaTag, TagDefinition, TagDimension } from "../features/tags/entity";
const dbPath = join(app.getPath("userData"), "fanslib.sqlite");

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
