import { channelsDb } from "./base";
import { RawChannel } from "./type";

export const updateChannel = async (
  id: string,
  updates: Partial<Omit<RawChannel, "id">>
): Promise<RawChannel | null> => {
  const db = await channelsDb();
  return new Promise((resolve, reject) => {
    db.update(
      { id },
      { $set: updates },
      { returnUpdatedDocs: true },
      (err, _numAffected, doc, _upserted) => {
        if (err) reject(err);
        else resolve(doc as RawChannel | null);
      }
    );
  });
};
