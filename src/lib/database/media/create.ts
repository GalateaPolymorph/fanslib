import { MediaFile } from "../../../features/library/shared/types";
import { mediaDb } from "./base";
import { RawMediaData } from "./type";

export const defaultMediaData = (file: MediaFile): RawMediaData => ({
  path: file.path,
  isNew: true,
  categoryIds: [],
});

export const createNewMediaData = async (file: MediaFile): Promise<RawMediaData> => {
  const database = await mediaDb();
  return new Promise((resolve, reject) => {
    database.insert(defaultMediaData(file), (err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};
