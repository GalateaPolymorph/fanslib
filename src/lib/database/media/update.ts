import { mediaDb } from "./base";
import { enrichMediaData } from "./enrich";
import { MediaData, RawMediaData } from "./type";

const updateMediaCategories = async (
  path: string,
  categoryIds: string[]
): Promise<MediaData | null> => {
  const database = await mediaDb();

  return new Promise((resolve, reject) => {
    database.update(
      { path },
      { $set: { categoryIds } },
      { returnUpdatedDocs: true },
      async (err, _numAffected, affectedDocuments, _upserted) => {
        if (err) reject(err);
        else {
          resolve(enrichMediaData(affectedDocuments));
        }
      }
    );
  });
};

const updateRawMediaData = async (
  path: string,
  updates: Partial<RawMediaData>
): Promise<RawMediaData | null> => {
  const database = await mediaDb();
  return new Promise((resolve, reject) => {
    database.update(
      { path },
      { $set: updates },
      { returnUpdatedDocs: true },
      (err, _numAffected, affectedDocuments, _upserted) => {
        if (err) reject(err);
        else resolve(affectedDocuments);
      }
    );
  });
};

export const updateMediaData = async (
  path: string,
  updates: Partial<MediaData>
): Promise<MediaData | null> => {
  const mediaData = await updateRawMediaData(path, updates);
  if (!mediaData) return null;

  if ("categoryIds" in updates && updates.categoryIds) {
    await updateMediaCategories(path, updates.categoryIds);
  }

  return enrichMediaData(mediaData);
};
