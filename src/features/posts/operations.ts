import { In } from "typeorm";
import { db } from "../../lib/db";
import { Media } from "../library/entity";
import { PostCreateData } from "./api-type";
import { Post, PostMedia, PostStatus } from "./entity";

export const createPost = async (postData: PostCreateData, mediaIds: string[]): Promise<Post> => {
  const dataSource = await db();
  const postRepo = dataSource.getRepository(Post);
  const mediaRepo = dataSource.getRepository(Media);
  const postMediaRepo = dataSource.getRepository(PostMedia);

  // Create post
  const post = postRepo.create({
    ...postData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await postRepo.save(post);

  // Add media if provided
  if (mediaIds.length) {
    const media = await mediaRepo.findBy({ id: In(mediaIds) });
    const postMedia = media.map((m, index) =>
      postMediaRepo.create({
        post,
        media: m,
        order: index,
      })
    );
    await postMediaRepo.save(postMedia);
  }

  return getPostById(post.id);
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  return repository.find({
    relations: {
      postMedia: {
        media: true,
      },
      channel: {
        type: true,
      },
      category: true,
    },
    order: {
      date: "DESC",
      postMedia: {
        order: "ASC",
      },
    },
  });
};

export const fetchPostById = async (id: string): Promise<Post | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  return repository.findOne({
    where: { id },
    relations: {
      postMedia: {
        media: true,
      },
      channel: {
        type: true,
      },
      category: true,
    },
    order: {
      postMedia: {
        order: "ASC",
      },
    },
  });
};

export const fetchPostsByMediaId = async (mediaId: string): Promise<Post[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  return repository.find({
    where: { postMedia: { media: { id: mediaId } } },
    relations: {
      postMedia: {
        media: {
          categories: true,
        },
      },
      channel: {
        type: true,
      },
      category: true,
    },
    order: {
      postMedia: {
        order: "ASC",
      },
    },
  });
};

export const fetchPostsByChannel = async (channelId: string): Promise<Post[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  return repository.find({
    where: { channelId },
    relations: {
      postMedia: {
        media: true,
      },
      channel: {
        type: true,
      },
      category: true,
    },
    order: {
      date: "DESC",
      postMedia: {
        order: "ASC",
      },
    },
  });
};

export const fetchPostsBySchedule = async (scheduleId: string): Promise<Post[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  return repository.find({
    where: { scheduleId },
    relations: {
      postMedia: {
        media: true,
      },
      channel: {
        type: true,
      },
      category: true,
    },
    order: {
      date: "DESC",
      postMedia: {
        order: "ASC",
      },
    },
  });
};

export const fetchScheduledPosts = async (): Promise<Post[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  return repository.find({
    where: { status: "scheduled" },
    relations: {
      postMedia: {
        media: true,
      },
      channel: {
        type: true,
      },
      category: true,
    },
    order: {
      date: "ASC",
      postMedia: {
        order: "ASC",
      },
    },
  });
};

export const updatePost = async (
  id: string,
  updates: Partial<Omit<Post, "id" | "media" | "channel" | "category">>,
  newMediaPathsInOrder?: string[]
): Promise<Post | null> => {
  const dataSource = await db();
  const postRepo = dataSource.getRepository(Post);
  const mediaRepo = dataSource.getRepository(Media);
  const postMediaRepo = dataSource.getRepository(PostMedia);

  const post = await postRepo.findOne({
    where: { id },
    relations: ["postMedia"],
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // Update basic post data
  Object.assign(post, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  await postRepo.save(post);

  // Update media if provided
  if (newMediaPathsInOrder) {
    // Remove existing media
    await postMediaRepo.delete({ post: { id: post.id } });

    // Add new media
    const media = await mediaRepo.findBy({ path: In(newMediaPathsInOrder) });
    const postMedia = media.map((m, index) =>
      postMediaRepo.create({
        post,
        media: m,
        order: index,
      })
    );
    await postMediaRepo.save(postMedia);
  }

  return getPostById(id);
};

export const updatePostStatus = async (id: string, status: PostStatus): Promise<Post | null> => {
  return updatePost(id, { status });
};

export const deletePost = async (id: string): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  await repository.delete(id);
};

export const getPostById = async (id: string) => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  return repository.findOne({
    where: { id },
    relations: {
      postMedia: {
        media: true,
      },
      channel: true,
      category: true,
    },
    order: {
      postMedia: {
        order: "ASC",
      },
    },
  });
};

export const getAllPosts = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  return repository.find({
    relations: {
      postMedia: {
        media: true,
      },
      channel: true,
      category: true,
    },
    order: {
      date: "DESC",
      postMedia: {
        order: "ASC",
      },
    },
  });
};
