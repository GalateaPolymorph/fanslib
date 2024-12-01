import { nanoid } from "nanoid";
import { contentSchedulesDb } from "./base";
import { ContentSchedule } from "./type";

export const createContentSchedule = async (
  data: Omit<ContentSchedule, "id" | "updatedAt" | "createdAt">
): Promise<ContentSchedule> => {
  const db = await contentSchedulesDb();
  const now = new Date().toISOString();

  const schedule: ContentSchedule = {
    ...data,
    id: nanoid(),
    updatedAt: now,
    createdAt: now,
  };

  return new Promise((resolve, reject) => {
    db.insert(schedule, (err, doc) => {
      if (err) reject(err);
      else resolve(doc as ContentSchedule);
    });
  });
};
