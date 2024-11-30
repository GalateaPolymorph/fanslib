import { contentSchedulesDb } from "./base";

export const deleteContentSchedule = async (id: string): Promise<void> => {
  const db = await contentSchedulesDb();
  return new Promise((resolve, reject) => {
    db.remove({ id }, {}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
