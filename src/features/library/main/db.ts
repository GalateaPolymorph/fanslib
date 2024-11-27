import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { app } from "electron";
import { join } from "path";
import type { MediaData, MediaFile } from "../shared/types";
import { mediaFiles } from "./schema";

// Initialize database in the user's app data directory
const dbPath = join(app.getPath("userData"), "library.db");
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

export type MediaDbRecord = {
  id: number;
  path: string;
  name: string;
} & MediaData;

export function upsertMediaFile(
  file: MediaFile,
  record: Partial<MediaDbRecord> = {}
): MediaDbRecord {
  return db
    .insert(mediaFiles)
    .values({
      path: file.path,
      name: file.name,
      ...record,
    })
    .onConflictDoUpdate({
      target: mediaFiles.path,
      set: {
        name: file.name,
        ...record,
      },
    })
    .returning()
    .get();
}

export function getMediaFileByPath(path: string): MediaDbRecord | undefined {
  return db.select().from(mediaFiles).where(eq(mediaFiles.path, path)).get();
}

export function updateMediaFile(
  path: string,
  updates: Partial<Omit<MediaDbRecord, "id" | "path">>
): MediaDbRecord | undefined {
  return db
    .update(mediaFiles)
    .set({
      ...updates,
    })
    .where(eq(mediaFiles.path, path))
    .returning()
    .get();
}

export function deleteMediaFile(path: string): void {
  db.delete(mediaFiles).where(eq(mediaFiles.path, path)).run();
}

// Clean up database connection when app exits
app.on("before-quit", () => {
  sqlite.close();
});
