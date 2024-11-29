import { channelsDb } from "./base";
import { Channel, RawChannel } from "./type";

export const updateChannel = async (
  id: string,
  updates: Partial<Omit<Channel, "id">>
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
