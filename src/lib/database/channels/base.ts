import { app } from "electron";
import { existsSync } from "fs";
import { unlink, writeFile } from "fs/promises";
import Datastore from "nedb";
import { join } from "path";

let channelsDatastore: Datastore | null;

const channelsDbPath = join(app.getPath("userData"), "channels.db");

export const channelsDb = async () => {
  if (channelsDatastore) return channelsDatastore;
  channelsDatastore = new Datastore({ filename: channelsDbPath, autoload: true });
  channelsDatastore.ensureIndex({ fieldName: "id", unique: true });
  return channelsDatastore;
};

export const resetChannelsDatabase = async (): Promise<void> => {
  channelsDatastore = null;

  if (existsSync(channelsDbPath)) {
    await unlink(channelsDbPath);
  }

  await writeFile(channelsDbPath, "", { flag: "w" });

  channelsDatastore = new Datastore({ filename: channelsDbPath, autoload: true });
  channelsDatastore.ensureIndex({ fieldName: "id", unique: true });
};
