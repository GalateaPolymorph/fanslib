import { nanoid } from "nanoid";
import { channelsDb } from "./base";
import { RawChannel } from "./type";

export const createChannel = async (data: Omit<RawChannel, "id">): Promise<RawChannel> => {
  const db = await channelsDb();
  const channel: RawChannel = {
    id: nanoid(),
    ...data,
  };

  return new Promise((resolve, reject) => {
    db.insert(channel, (err, doc) => {
      if (err) reject(err);
      else resolve(doc as RawChannel);
    });
  });
};
