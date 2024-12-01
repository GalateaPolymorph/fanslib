import { Media } from "./type";
import { mediaDb } from "./base";

export const createMedia = async (media: Media): Promise<Media> => {
  const database = await mediaDb();
  return new Promise((resolve, reject) => {
    database.insert(media, (err, doc) => {
      if (err) {
        console.error("Error creating media:", err);
        reject(err);
      }
      resolve(doc);
    });
  });
};
