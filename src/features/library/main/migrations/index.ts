import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { db } from "../db";

export async function runMigrations() {
  const metaDir = join(__dirname, "meta");

  // Ensure meta directory exists
  if (!existsSync(metaDir)) {
    mkdirSync(metaDir, { recursive: true });
  }

  try {
    await migrate(db, {
      migrationsFolder: join(__dirname),
    });
    console.log("Migrations ran successfully");
  } catch (error) {
    console.error("Error running migrations:", error);

    // If journal file is missing, create a basic one
    const journalPath = join(metaDir, "_journal.json");
    if (!existsSync(journalPath)) {
      const basicJournal = {
        version: "5",
        dialect: "sqlite",
        entries: [],
      };
      require("fs").writeFileSync(journalPath, JSON.stringify(basicJournal, null, 2));

      // Retry migration
      try {
        await migrate(db, {
          migrationsFolder: join(__dirname),
        });
        console.log("Migrations ran successfully after journal file creation");
      } catch (retryError) {
        console.error("Failed to run migrations after journal file creation:", retryError);
        throw retryError;
      }
    } else {
      throw error;
    }
  }
}
