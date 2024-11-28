import { channelsDb } from "./base";

export const deleteChannel = async (id: string): Promise<boolean> => {
  const db = await channelsDb();
  return new Promise((resolve, reject) => {
    db.remove({ id }, {}, (err, numRemoved) => {
      if (err) reject(err);
      else resolve(numRemoved > 0);
    });
  });
};
