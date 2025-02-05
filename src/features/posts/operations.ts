import { In } from "typeorm";
import { db } from "../../lib/db";
import { Media } from "../library/entity";
import { PostCreateData } from "./api-type";
import { Post, PostMedia } from "./entity";

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

  const newPost = await getPostById(post.id);
  return newPost;
};

export const fetchPostById = async (id: string): Promise<Post | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  return repository.findOne({
    where: { id },
    relations: {
      postMedia: {
        media: {
          tags: true,
          tier: true,
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

export const fetchPostsByMediaId = async (mediaId: string): Promise<Post[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  // First get the post IDs that have the specified media
  const postsWithMedia = await repository
    .createQueryBuilder("post")
    .innerJoin("post.postMedia", "pm")
    .innerJoin("pm.media", "media")
    .where("media.id = :mediaId", { mediaId })
    .select("post.id")
    .getMany();

  if (postsWithMedia.length === 0) {
    return [];
  }

  // Then fetch the complete posts with all their postMedia
  const posts = await repository.find({
    where: {
      id: In(postsWithMedia.map((p) => p.id)),
    },
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

  return posts;
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

export const updatePost = async (
  id: string,
  updates: Partial<Omit<Post, "id" | "media" | "channel" | "category">>,
  mediaIds?: string[]
): Promise<Post | null> => {
  const dataSource = await db();
  const postRepo = dataSource.getRepository(Post);
  const mediaRepo = dataSource.getRepository(Media);
  const postMediaRepo = dataSource.getRepository(PostMedia);

  const post = await postRepo.findOne({
    where: { id },
    relations: {
      postMedia: {
        media: true,
      },
    },
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
  if (mediaIds) {
    // Check if we need to remove any media
    const currentMediaIds = post.postMedia.map((pm) => pm.media.id);
    const mediaToRemove = currentMediaIds.filter((id) => !mediaIds.includes(id));

    if (mediaToRemove.length) {
      await postMediaRepo.delete({ post: { id }, media: { id: In(mediaToRemove) } });
    }

    // Check if we need to add any new media
    const mediaToAdd = mediaIds.filter((id) => !currentMediaIds.includes(id));
    if (mediaToAdd.length) {
      const media = await mediaRepo.findBy({ id: In(mediaToAdd) });
      const postMedia = media.map((m, index) =>
        postMediaRepo.create({
          post,
          media: m,
          order: index,
        })
      );
      await postMediaRepo.save(postMedia);
    }
  }

  return getPostById(id);
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
        media: {
          tags: true,
          tier: true,
        },
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
        media: {
          tags: true,
          tier: true,
        },
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

export const setFreePreview = async (
  postId: string,
  mediaId: string,
  isFreePreview: boolean
): Promise<Post | null> => {
  const dataSource = await db();
  const postMediaRepo = dataSource.getRepository(PostMedia);

  const postMedia = await postMediaRepo.findOne({
    where: {
      post: { id: postId },
      media: { id: mediaId },
    },
    relations: {
      post: true,
      media: true,
    },
  });

  if (!postMedia) {
    return null;
  }

  postMedia.isFreePreview = isFreePreview;
  await postMediaRepo.save(postMedia);

  return getPostById(postId);
};
