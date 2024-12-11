import { db, uninitialize } from "../../lib/db";

export const resetDatabase = async () => {
  const database = await db();
  // Drop database and reinitialize
  await database.dropDatabase();
  await uninitialize();
  await db();
};
