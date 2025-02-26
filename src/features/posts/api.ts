import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, PostHandlers } from "./api-type";
import { Post } from "./entity";
import {
  createPost,
  deletePost,
  fetchPostById,
  fetchPostsByChannel,
  fetchPostsByMediaId,
  fetchPostsBySchedule,
  fetchPostsByUrl,
  getAllPosts,
  setFreePreview,
  updatePost,
} from "./operations";

export const handlers: PostHandlers = {
  create: (_, data, mediaIds) => createPost(data, mediaIds),
  getAll: (_, filters) => getAllPosts(filters),
  byId: (_, id: string) => fetchPostById(id),
  bySchedule: (_, scheduleId: string) => fetchPostsBySchedule(scheduleId),
  byChannel: (_, channelId: string) => fetchPostsByChannel(channelId),
  byMediaId: (_, mediaId: string) => fetchPostsByMediaId(mediaId),
  byUrl: (_, url: string) => fetchPostsByUrl(url),
  update: (_, id: string, updates: Partial<Post>, newMediaPathsInOrder?: string[]) =>
    updatePost(id, updates, newMediaPathsInOrder),
  delete: (_, id) => deletePost(id),
  addMedia: async (_, postId: string, mediaIds: string[]) => {
    const post = await fetchPostById(postId);
    if (!post) return null;

    return updatePost(postId, {}, [...post.postMedia.map((pm) => pm.media.id), ...mediaIds]);
  },
  removeMedia: async (_, postId: string, postMediaIdsToRemove: string[]) => {
    const post = await fetchPostById(postId);
    if (!post) return null;

    return updatePost(
      postId,
      {},
      post?.postMedia.filter((pm) => !postMediaIdsToRemove.includes(pm.id)).map((pm) => pm.media.id)
    );
  },
  setFreePreview: (_, postId: string, mediaId: string, isFreePreview: boolean) =>
    setFreePreview(postId, mediaId, isFreePreview),
};

export const postHandlers = prefixNamespaceObject(namespace, handlers);
