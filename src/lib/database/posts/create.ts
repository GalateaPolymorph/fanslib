import { nanoid } from "nanoid";
import { addMetadataToPost, postsDb } from "./base";
import { RawPost } from "./type";

export const createPost = async (data: Omit<RawPost, "id" | "createdAt" | "updatedAt">) => {
  const db = await postsDb();

  const post = addMetadataToPost({
    id: nanoid(),
    ...data,
  });

  return new Promise<RawPost>((resolve, reject) => {
    db.insert(post, (err, newDoc) => {
      if (err) reject(err);
      else resolve(newDoc as RawPost);
    });
  });
};
