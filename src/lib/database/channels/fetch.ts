import { channelsDb } from "./base";
import { enrichChannel } from "./enrich";
import { Channel, RawChannel } from "./type";

const fetchRawChannelById = async (id: string): Promise<RawChannel | null> => {
  const db = await channelsDb();
  return new Promise((resolve, reject) => {
    db.findOne({ id }, (err, doc) => {
      if (err) reject(err);
      else resolve(doc as RawChannel | null);
    });
  });
};

export const fetchChannelById = async (id: string): Promise<Channel | null> => {
  const rawChannel = await fetchRawChannelById(id);
  return rawChannel ? enrichChannel(rawChannel) : null;
};

const fetchAllRawChannels = async (): Promise<RawChannel[]> => {
  const db = await channelsDb();
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      if (err) reject(err);
      else resolve(docs as RawChannel[]);
    });
  });
};

export const fetchAllChannels = async (): Promise<Channel[]> => {
  const rawChannels = await fetchAllRawChannels();
  return Promise.all(rawChannels.map(enrichChannel)).then(
    (channels) => channels.filter(Boolean) as Channel[]
  );
};
