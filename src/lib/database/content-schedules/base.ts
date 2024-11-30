import { app } from "electron";
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import Datastore from "nedb";
import { join } from "path";

let contentSchedulesDatastore: Datastore | null;

const contentSchedulesDbPath = join(app.getPath("userData"), "content-schedules.db");

export const contentSchedulesDb = async () => {
  if (contentSchedulesDatastore) return contentSchedulesDatastore;
  contentSchedulesDatastore = new Datastore({ filename: contentSchedulesDbPath, autoload: true });
  contentSchedulesDatastore.ensureIndex({ fieldName: "id", unique: true });
  return contentSchedulesDatastore;
};

export const resetContentSchedulesDatabase = async (): Promise<void> => {
  contentSchedulesDatastore = null;

  if (existsSync(contentSchedulesDbPath)) {
    await unlink(contentSchedulesDbPath);
  }
};
