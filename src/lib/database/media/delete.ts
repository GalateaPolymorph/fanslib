import { mediaDb } from "./base";

export const deleteMedia = async (path: string): Promise<void> => {
  const database = await mediaDb();
  return new Promise((resolve, reject) => {
    database.remove({ path }, {}, (err: Error | null) => {
      if (err) {
        console.error("Error deleting media:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
