import { sql } from "drizzle-orm";
import { type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export async function up(db: BetterSQLite3Database) {
  db.run(sql`
    CREATE TABLE IF NOT EXISTS media_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      is_new INTEGER NOT NULL DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_media_files_path ON media_files(path);
  `);
}

export async function down(db: BetterSQLite3Database) {
  db.run(sql`
    DROP TABLE IF EXISTS media_files;
  `);
}
