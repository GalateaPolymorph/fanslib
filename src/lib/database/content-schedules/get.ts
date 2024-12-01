import { contentSchedulesDb } from "./base";
import { ContentSchedule } from "./type";

export const getContentSchedule = async (id: string): Promise<ContentSchedule | null> => {
  const db = await contentSchedulesDb();
  return new Promise((resolve, reject) => {
    db.findOne({ id }, (err, doc) => {
      if (err) reject(err);
      else resolve(doc as ContentSchedule | null);
    });
  });
};

export const getContentSchedulesForChannel = async (
  channelId: string
): Promise<ContentSchedule[]> => {
  const db = await contentSchedulesDb();
  return new Promise((resolve, reject) => {
    db.find({ channelId }, (err, docs) => {
      if (err) reject(err);
      else resolve(docs as ContentSchedule[]);
    });
  });
};

export const getAllContentSchedules = async () => {
  const db = await contentSchedulesDb();
  return new Promise<ContentSchedule[]>((resolve, reject) => {
    db.find({})
      .sort({ updatedAt: -1 })
      .exec((err, docs) => {
        if (err) reject(err);
        else resolve(docs as ContentSchedule[]);
      });
  });
};
