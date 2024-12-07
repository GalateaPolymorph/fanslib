import { db } from "../../lib/db";
import { PostCreateData } from "./api-type";
import { Post, PostMedia, PostStatus } from "./entity";

export const createPost = async (
  postData: PostCreateData,
  mediaPathsInOrder: string[]
): Promise<Post> => {
  const dataSource = await db();

  return dataSource.transaction(async (manager) => {
    // Create post
    const post = new Post();
    Object.assign(post, {
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await manager.save(post);

    // Create media orders
    if (mediaPathsInOrder.length > 0) {
      const mediaOrders = mediaPathsInOrder.map((path, index) => {
        const mediaOrder = new PostMedia();
        mediaOrder.postId = post.id;
        mediaOrder.path = path;
        mediaOrder.order = index;
        return mediaOrder;
      });
      await manager.save(PostMedia, mediaOrders);
    }

    // Load and return complete post
    return manager
      .createQueryBuilder(Post, "post")
      .leftJoinAndSelect("post.media", "postMedia")
      .leftJoinAndSelect("postMedia.media", "media")
      .leftJoinAndSelect("post.channel", "channel")
      .leftJoinAndSelect("post.category", "category")
      .where("post.id = :id", { id: post.id })
      .orderBy("postMedia.order", "ASC")
      .getOne() as Promise<Post>;
  });
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  const dataSource = await db();

  return dataSource
    .createQueryBuilder(Post, "post")
    .leftJoinAndSelect("post.media", "postMedia")
    .leftJoinAndSelect("postMedia.media", "media")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.category", "category")
    .orderBy("post.scheduledDate", "DESC")
    .addOrderBy("postMedia.order", "ASC")
    .getMany();
};

export const fetchPostById = async (id: string): Promise<Post | null> => {
  const dataSource = await db();

  return dataSource
    .createQueryBuilder(Post, "post")
    .leftJoinAndSelect("post.media", "postMedia")
    .leftJoinAndSelect("postMedia.media", "media")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.category", "category")
    .where("post.id = :id", { id })
    .orderBy("postMedia.order", "ASC")
    .getOne();
};

export const fetchPostsByMediaPath = async (mediaPath: string): Promise<Post[]> => {
  const dataSource = await db();

  return dataSource
    .createQueryBuilder(Post, "post")
    .leftJoinAndSelect("post.media", "postMedia")
    .leftJoinAndSelect("postMedia.media", "media")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.category", "category")
    .where("media.path = :mediaPath", { mediaPath })
    .orderBy("postMedia.order", "ASC")
    .getMany();
};

export const fetchPostsByChannel = async (channelId: string): Promise<Post[]> => {
  const dataSource = await db();

  return dataSource
    .createQueryBuilder(Post, "post")
    .leftJoinAndSelect("post.media", "postMedia")
    .leftJoinAndSelect("postMedia.media", "media")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.category", "category")
    .where("post.channelId = :channelId", { channelId })
    .orderBy("post.scheduledDate", "DESC")
    .addOrderBy("postMedia.order", "ASC")
    .getMany();
};

export const fetchPostsBySchedule = async (scheduleId: string): Promise<Post[]> => {
  const dataSource = await db();

  return dataSource
    .createQueryBuilder(Post, "post")
    .leftJoinAndSelect("post.media", "postMedia")
    .leftJoinAndSelect("postMedia.media", "media")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.category", "category")
    .where("post.scheduleId = :scheduleId", { scheduleId })
    .orderBy("post.scheduledDate", "DESC")
    .addOrderBy("postMedia.order", "ASC")
    .getMany();
};

export const fetchScheduledPosts = async (): Promise<Post[]> => {
  const dataSource = await db();

  return dataSource
    .createQueryBuilder(Post, "post")
    .leftJoinAndSelect("post.media", "postMedia")
    .leftJoinAndSelect("postMedia.media", "media")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.category", "category")
    .where("post.status = :status", { status: "scheduled" })
    .orderBy("post.scheduledDate", "ASC")
    .addOrderBy("postMedia.order", "ASC")
    .getMany();
};

export const updatePost = async (
  id: string,
  updates: Partial<Omit<Post, "id" | "mediaOrders" | "channel" | "category">>,
  newMediaPathsInOrder?: string[]
): Promise<Post | null> => {
  const dataSource = await db();

  return dataSource.transaction(async (manager) => {
    // Update post
    await manager.update(
      Post,
      { id },
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    );

    // If new media paths provided, update media orders
    if (newMediaPathsInOrder !== undefined) {
      // Delete existing media orders
      await manager.delete(PostMedia, { postId: id });

      // Create new media orders if there are any
      if (newMediaPathsInOrder.length > 0) {
        const postMedias = newMediaPathsInOrder.map((path, index) => {
          const postMedia = new PostMedia();
          postMedia.postId = id;
          postMedia.path = path;
          postMedia.order = index;
          return postMedia;
        });
        await manager.save(PostMedia, postMedias);
      }
    }

    // Load and return updated post
    return manager
      .createQueryBuilder(Post, "post")
      .leftJoinAndSelect("post.media", "postMedia")
      .leftJoinAndSelect("postMedia.media", "media")
      .leftJoinAndSelect("post.channel", "channel")
      .leftJoinAndSelect("post.category", "category")
      .where("post.id = :id", { id })
      .orderBy("postMedia.order", "ASC")
      .getOne();
  });
};

export const updatePostStatus = async (id: string, status: PostStatus): Promise<Post | null> => {
  return updatePost(id, { status });
};

export const deletePost = async (id: string): Promise<void> => {
  const dataSource = await db();

  await dataSource.transaction(async (manager) => {
    // Delete media orders first (due to foreign key constraint)
    await manager.delete(PostMedia, { postId: id });
    // Delete post
    await manager.delete(Post, { id });
  });
};
