import { db } from "../../lib/db";

export const resetDatabase = async () => {
  const database = await db();
  // Drop database and reinitialize
  await database.dropDatabase();
  await database.destroy();
  await db();
};
