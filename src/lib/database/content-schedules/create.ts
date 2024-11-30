import { nanoid } from "nanoid";
import { contentSchedulesDb } from "./base";
import { ContentSchedule } from "./type";

export const createContentSchedule = async (
  schedule: Omit<ContentSchedule, "id">
): Promise<ContentSchedule> => {
  const db = await contentSchedulesDb();
  const newSchedule = {
    ...schedule,
    id: nanoid(),
  };

  return new Promise((resolve, reject) => {
    db.insert(newSchedule, (err, doc) => {
      if (err) reject(err);
      else resolve(doc as ContentSchedule);
    });
  });
};
