import { mediaDb } from "./base";
import { enrichMedia } from "./enrich";
import { Media } from "./type";

export const fetchAllMedia = async (): Promise<Media[]> => {
  const database = await mediaDb();
  try {
    const media = await new Promise<Media[]>((resolve, reject) => {
      database.find({}, (err: Error | null, docs: Media[]) => {
        if (err) {
          console.error("Error fetching all media:", err);
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });

    // Enrich all media with their categories
    const enrichedMedia = await Promise.all(media.map(enrichMedia));
    return enrichedMedia;
  } catch (error) {
    console.error("Error in fetchAllMedia:", error);
    return [];
  }
};
