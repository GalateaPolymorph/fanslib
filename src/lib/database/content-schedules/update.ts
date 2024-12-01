import { contentSchedulesDb } from "./base";
import { ContentSchedule } from "./type";

export const updateContentSchedule = (
  id: string,
  updates: Partial<ContentSchedule>
): Promise<ContentSchedule> => {
  return new Promise((resolve, reject) => {
    contentSchedulesDb().then((db) => {
      db.update(
        { id },
        {
          $set: {
            ...updates,
            lastSynced: null, // Reset lastSynced to trigger a new sync
            updatedAt: new Date().toISOString(),
          },
        },
        { returnUpdatedDocs: true },
        (err, numAffected, affectedDocuments, _upserted) => {
          if (err) reject(err);
          else if (numAffected === 0) reject(new Error("Schedule not found"));
          else resolve(affectedDocuments as ContentSchedule);
        }
      );
    });
  });
};
