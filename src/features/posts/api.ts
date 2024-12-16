import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, PostHandlers } from "./api-type";
import { Post } from "./entity";
import {
  createPost,
  deletePost,
  fetchAllPosts,
  fetchPostById,
  fetchPostsByChannel,
  fetchPostsByMediaId,
  fetchPostsBySchedule,
  setFreePreview,
  updatePost,
} from "./operations";

export const handlers: PostHandlers = {
  create: (_, data, mediaIds) => createPost(data, mediaIds),
  getAll: (_) => fetchAllPosts(),
  byId: (_, id: string) => fetchPostById(id),
  bySchedule: (_, scheduleId: string) => fetchPostsBySchedule(scheduleId),
  byChannel: (_, channelId: string) => fetchPostsByChannel(channelId),
  byMediaId: (_, mediaId: string) => fetchPostsByMediaId(mediaId),
  update: (_, id: string, updates: Partial<Post>, newMediaPathsInOrder?: string[]) =>
    updatePost(id, updates, newMediaPathsInOrder),
  delete: (_, id) => deletePost(id),
  addMedia: (_, postId: string, mediaPaths: string[]) => updatePost(postId, {}, mediaPaths),
  removeMedia: async (_, postId: string, mediaToRemove: string[]) => {
    const post = await fetchPostById(postId);
    if (!post) return null;
    return updatePost(
      postId,
      {},
      post?.postMedia.filter((m) => !mediaToRemove.includes(m.id)).map((m) => m.id)
    );
  },
  setFreePreview: (_, postId: string, mediaId: string, isFreePreview: boolean) =>
    setFreePreview(postId, mediaId, isFreePreview),
};

export const postHandlers = prefixNamespaceObject(namespace, handlers);
