import { nanoid } from "nanoid";
import { channelsDb } from "./base";
import { enrichChannel } from "./enrich";
import { Channel, RawChannel } from "./type";

export const createChannel = async (data: Omit<RawChannel, "id">): Promise<Channel | null> => {
  const db = await channelsDb();
  const channel: RawChannel = {
    id: nanoid(),
    ...data,
  };

  return new Promise((resolve, reject) => {
    db.insert(channel, (err, doc) => {
      if (err) return reject(err);
      if (!doc) return resolve(null);
      return resolve(doc && enrichChannel(doc as RawChannel));
    });
  });
};
