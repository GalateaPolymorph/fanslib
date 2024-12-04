import { postsDb } from "./base";
import { enrichPosts } from "./enrich";
import { Post, RawPost } from "./type";

export const getAllPosts = async (): Promise<Post[]> => {
  const db = await postsDb();
  const posts = await new Promise<RawPost[]>((resolve, reject) => {
    db.find({})
      .sort({ scheduledDate: 1 })
      .exec((err, docs) => {
        if (err) reject(err);
        else resolve(docs as RawPost[]);
      });
  });
  return enrichPosts(posts);
};

export const getPostsBySchedule = async (scheduleId: string): Promise<Post[]> => {
  const db = await postsDb();
  const posts = await new Promise<RawPost[]>((resolve, reject) => {
    db.find({ scheduleId })
      .sort({ scheduledDate: 1 })
      .exec((err, docs) => {
        if (err) reject(err);
        else resolve(docs as RawPost[]);
      });
  });
  return enrichPosts(posts);
};

export const getPostsByChannel = async (channelId: string): Promise<Post[]> => {
  const db = await postsDb();
  const posts = await new Promise<RawPost[]>((resolve, reject) => {
    db.find({ channelId })
      .sort({ scheduledDate: 1 })
      .exec((err, docs) => {
        if (err) reject(err);
        else resolve(docs as RawPost[]);
      });
  });
  return enrichPosts(posts);
};

export const getPostsByMediaPath = async (mediaPath: string): Promise<Post[]> => {
  const db = await postsDb();
  const posts = await new Promise<RawPost[]>((resolve, reject) => {
    db.find({ "mediaIds.path": mediaPath })
      .sort({ scheduledDate: 1 })
      .exec((err, docs) => {
        if (err) reject(err);
        else resolve(docs as RawPost[]);
      });
  });
  return enrichPosts(posts);
};
