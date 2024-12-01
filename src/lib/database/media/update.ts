import { mediaDb } from "./base";
import { enrichMedia } from "./enrich";
import { Media } from "./type";

const updateMediaCategories = async (
  path: string,
  categoryIds: string[]
): Promise<Media | null> => {
  const database = await mediaDb();

  return new Promise((resolve, reject) => {
    database.update(
      { path },
      { $set: { categoryIds } },
      { returnUpdatedDocs: true },
      async (err, _numAffected, affectedDocuments, _upsert) => {
        if (err) reject(err);
        else {
          const enriched = await enrichMedia(affectedDocuments);
          resolve(enriched);
        }
      }
    );
  });
};

const updateRawMediaData = async (path: string, updates: Partial<Media>): Promise<Media | null> => {
  const database = await mediaDb();
  return new Promise((resolve, reject) => {
    database.update(
      { path },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnUpdatedDocs: true },
      async (err, _numAffected, affectedDocuments, _upsert) => {
        if (err) reject(err);
        else {
          const enriched = await enrichMedia(affectedDocuments);
          resolve(enriched);
        }
      }
    );
  });
};

export const updateMedia = async (path: string, updates: Partial<Media>): Promise<Media | null> => {
  console.log("Updating media", path, updates);
  // If we're updating categories, do that first
  if ("categoryIds" in updates && updates.categoryIds) {
    const categoryUpdate = await updateMediaCategories(path, updates.categoryIds);
    if (!categoryUpdate) return null;

    // Remove categoryIds from updates since we've handled them
    const { categoryIds, ...otherUpdates } = updates;

    // If there are other updates, apply them
    if (Object.keys(otherUpdates).length > 0) {
      return updateRawMediaData(path, otherUpdates);
    }

    return categoryUpdate;
  }

  // If no category updates, just update the raw data
  return updateRawMediaData(path, updates);
};
