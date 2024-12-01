import { mediaDb } from "./base";
import { enrichMedia } from "./enrich";
import { Media } from "./type";

export const fetchAllMedia = async (): Promise<Media[]> => {
  const database = await mediaDb();
  return new Promise<Media[]>((resolve) => {
    database.find({}, (err: Error | null, docs: Media[]) => {
      if (err) {
        console.error("Error fetching all media:", err);
        resolve([]);
      }
      resolve(docs);
    });
  }).then((media) => Promise.all(media.map(enrichMedia)));
};
