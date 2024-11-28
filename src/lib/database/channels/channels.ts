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

export const fetchAllChannels = async (): Promise<RawChannel[]> => {
  const db = await channelsDb();
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      if (err) reject(err);
      else resolve(docs as RawChannel[]);
    });
  });
};

export const fetchChannelById = async (id: string): Promise<RawChannel | null> => {
  const db = await channelsDb();
  return new Promise((resolve, reject) => {
    db.findOne({ id }, (err, doc) => {
      if (err) reject(err);
      else resolve(doc as RawChannel | null);
    });
  });
};

export const updateChannel = async (
  id: string,
  updates: Partial<Omit<RawChannel, "id">>
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

export const deleteChannel = async (id: string): Promise<boolean> => {
  const db = await channelsDb();
  return new Promise((resolve, reject) => {
    db.remove({ id }, {}, (err, numRemoved) => {
      if (err) reject(err);
      else resolve(numRemoved > 0);
    });
  });
};
