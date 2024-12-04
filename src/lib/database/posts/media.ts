import { postsDb } from "./base";
import { MediaId, Post, RawPost } from "./type";

export const addMediaToPost = async (
  postId: string,
  paths: string[]
): Promise<Post | undefined> => {
  const database = await postsDb();

  return new Promise((resolve) => {
    database.findOne({ id: postId }, (err: Error | null, post: Post | null) => {
      if (err || !post) {
        console.error("Error finding post:", err);
        resolve(undefined);
        return;
      }

      const currentMaxOrder = post.mediaIds.reduce((max, m) => Math.max(max, m.order), -1);
      const newMediaIds: MediaId[] = paths.map((path, index) => ({
        path,
        order: currentMaxOrder + 1 + index,
      }));

      database.update(
        { id: postId },
        { $push: { mediaIds: { $each: newMediaIds } } },
        { returnUpdatedDocs: true },
        (err: Error | null, _numAffected: number, updatedDoc: Post | null) => {
          if (err || !updatedDoc) {
            console.error("Error updating post:", err);
            resolve(undefined);
            return;
          }
          resolve(updatedDoc);
        }
      );
    });
  });
};

export const removeMediaFromPost = async (postId: string, paths: string[]): Promise<RawPost> => {
  const db = await postsDb();

  return new Promise<RawPost>((resolve, reject) => {
    db.findOne({ id: postId }, (err, post: RawPost | null) => {
      if (err) {
        reject(err);
        return;
      }
      if (!post) {
        reject(new Error("Post not found"));
        return;
      }

      const updatedMedia = post.mediaIds.filter((m) => !paths.includes(m.path));
      // Reorder remaining media
      updatedMedia.forEach((m, index) => {
        m.order = index;
      });

      db.update(
        { id: postId },
        {
          $set: {
            mediaIds: updatedMedia,
            updatedAt: new Date().toISOString(),
          },
        },
        { returnUpdatedDocs: true },
        (updateErr, numAffected, affectedDocuments, _upserted) => {
          if (updateErr) reject(updateErr);
          else if (numAffected === 0) reject(new Error("Post not found"));
          else resolve(affectedDocuments as RawPost);
        }
      );
    });
  });
};

export const reorderPostMedia = async (
  postId: string,
  mediaOrder: { path: string; order: number }[]
): Promise<RawPost> => {
  const db = await postsDb();

  return new Promise<RawPost>((resolve, reject) => {
    db.findOne({ id: postId }, (err, post: RawPost | null) => {
      if (err) {
        reject(err);
        return;
      }
      if (!post) {
        reject(new Error("Post not found"));
        return;
      }

      // Create a map of path to new order
      const orderMap = new Map(mediaOrder.map((m) => [m.path, m.order]));

      // Update orders of existing media
      const updatedMedia = post.mediaIds.map((m) => ({
        ...m,
        order: orderMap.get(m.path) ?? m.order,
      }));

      // Sort by order to ensure consistency
      updatedMedia.sort((a, b) => a.order - b.order);

      db.update(
        { id: postId },
        {
          $set: {
            mediaIds: updatedMedia,
            updatedAt: new Date().toISOString(),
          },
        },
        { returnUpdatedDocs: true },
        (updateErr, numAffected, affectedDocuments, _upserted) => {
          if (updateErr) reject(updateErr);
          else if (numAffected === 0) reject(new Error("Post not found"));
          else resolve(affectedDocuments as RawPost);
        }
      );
    });
  });
};
