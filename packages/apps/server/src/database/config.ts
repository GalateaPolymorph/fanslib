import { DataSource } from "typeorm";
import { RedditQueueJob, RedditQueueLog, RedditSession } from "./entities";

const isDev = process.env.NODE_ENV === "development";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "fanslib-server.sqlite",
  entities: [RedditQueueJob, RedditQueueLog, RedditSession],
  synchronize: true,
  logging: isDev,
});

let initialized = false;

export const getDatabase = async () => {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
  }
  return AppDataSource;
};
