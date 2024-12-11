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
  markAsScheduled: (_, id: string) => updatePost(id, { status: "scheduled" }),
  markAsPosted: (_, id: string) => updatePost(id, { status: "posted" }),
  markAsPlanned: (_, id: string) => updatePost(id, { status: "planned" }),
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
};

export const postHandlers = prefixNamespaceObject(namespace, handlers);
