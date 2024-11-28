import { app } from "electron";
import { existsSync } from "fs";
import { unlink, writeFile } from "fs/promises";
import Datastore from "nedb";
import { join } from "path";
import type { MediaData, MediaFile } from "../shared/types";

let mediaDb: Datastore | null;
const dbPath = join(app.getPath("userData"), "library.db");

const db = async () => {
  if (mediaDb) return mediaDb;
  mediaDb = new Datastore({ filename: dbPath, autoload: true });
  mediaDb.ensureIndex({ fieldName: "path", unique: true });
  return mediaDb;
};

export async function upsertMediaFile(
  file: MediaFile,
  record: Partial<MediaData> = {}
): Promise<MediaData> {
  const database = await db();
  return new Promise((resolve, reject) => {
    database.update(
      { path: file.path },
      { $set: { ...file, ...record } },
      { upsert: true, returnUpdatedDocs: true },
      (err, numAffected, affectedDocuments) => {
        if (err) reject(err);
        else resolve(affectedDocuments);
      }
    );
  });
}

export async function getMediaFileByPath(path: string): Promise<MediaData | null> {
  const database = await db();
  return new Promise((resolve, reject) => {
    database.findOne({ path }, (err: Error | null, doc: MediaData | null) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
}

export async function updateMediaFile(
  path: string,
  updates: Partial<MediaData>
): Promise<MediaData | null> {
  const database = await db();
  return new Promise((resolve, reject) => {
    database.update(
      { path },
      { $set: updates },
      { returnUpdatedDocs: true },
      (err, numAffected, affectedDocuments) => {
        if (err) reject(err);
        else resolve(affectedDocuments);
      }
    );
  });
}

export async function getAllMediaFiles(): Promise<MediaData[]> {
  const database = await db();
  return new Promise((resolve, reject) => {
    database.find({}, (err: Error | null, docs: MediaData[]) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
}

export async function deleteMediaFile(path: string): Promise<void> {
  const database = await db();
  return new Promise((resolve, reject) => {
    database.remove({ path }, {}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function resetDatabase(): Promise<void> {
  mediaDb = null;

  if (existsSync(dbPath)) {
    await unlink(dbPath);
  }

  await writeFile(dbPath, "", { flag: "w" });

  mediaDb = new Datastore({ filename: dbPath, autoload: true });
  mediaDb.ensureIndex({ fieldName: "path", unique: true });
}
