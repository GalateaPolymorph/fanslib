import { mediaDb } from "./base";

export const deleteMediaData = async (path: string): Promise<void> => {
  const database = await mediaDb();
  return new Promise((resolve, reject) => {
    database.remove({ path }, {}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
