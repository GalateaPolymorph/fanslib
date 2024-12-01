import { addMetadataToPost, postsDb } from "./base";
import { enrichPost } from "./enrich";
import { Post, RawPost } from "./type";

export const updatePost = async (id: string, updates: Partial<RawPost>): Promise<Post> => {
  const db = await postsDb();
  const enrichedUpdates = addMetadataToPost(updates);

  const rawPost = await new Promise<RawPost>((resolve, reject) => {
    db.update(
      { id },
      { $set: enrichedUpdates },
      { returnUpdatedDocs: true },
      (err, numAffected, affectedDocuments, _upserted) => {
        if (err) reject(err);
        else if (numAffected === 0) reject(new Error("Post not found"));
        else resolve(affectedDocuments as RawPost);
      }
    );
  });

  return enrichPost(rawPost);
};

export const markPostAsPosted = async (id: string) => {
  return updatePost(id, { status: "posted" });
};
