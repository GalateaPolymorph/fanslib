import { contentSchedulesDb } from "./base";
import { ContentSchedule } from "./type";

export const updateContentSchedule = async (
  schedule: ContentSchedule
): Promise<ContentSchedule> => {
  const db = await contentSchedulesDb();
  return new Promise((resolve, reject) => {
    db.update(
      { id: schedule.id },
      schedule,
      { returnUpdatedDocs: true },
      (err, _numAffected, doc, _upserted) => {
        if (err) reject(err);
        else if (!doc) reject(new Error("Schedule not found"));
        else resolve(doc as ContentSchedule);
      }
    );
  });
};
