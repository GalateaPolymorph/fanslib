import { mediaDb } from "./base";
import { enrichMediaData } from "./enrich";
import { MediaData, RawMediaData } from "./type";

const fetchRawMediaDataByPath = async (path: string): Promise<RawMediaData | null> => {
  const database = await mediaDb();
  return new Promise((resolve, reject) => {
    database.findOne({ path }, (err: Error | null, doc: RawMediaData | null) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

export const fetchMediaDataByPath = async (path: string): Promise<MediaData | null> => {
  const rawMediaData = await fetchRawMediaDataByPath(path);
  return rawMediaData ? enrichMediaData(rawMediaData) : null;
};

const fetchAllRawMediaData = async (): Promise<RawMediaData[]> => {
  const database = await mediaDb();
  return new Promise((resolve, reject) => {
    database.find({}, (err: Error | null, docs: RawMediaData[]) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
};

export const fetchAllMediaData = async (): Promise<MediaData[]> => {
  const rawMediaData = await fetchAllRawMediaData();
  return Promise.all(rawMediaData.map(enrichMediaData)).then(
    (mediaData) => mediaData.filter(Boolean) as MediaData[]
  );
};
