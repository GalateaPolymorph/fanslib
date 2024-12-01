import { postsDb } from "./base";

export const deletePost = async (id: string) => {
  const db = await postsDb();
  return new Promise<void>((resolve, reject) => {
    db.remove({ id }, {}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
