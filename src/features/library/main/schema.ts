import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const mediaFiles = sqliteTable("media_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  path: text("path").notNull().unique(),
  name: text("name").notNull(),
  isNew: integer("is_new", { mode: "boolean" }).notNull().default(true),
});
