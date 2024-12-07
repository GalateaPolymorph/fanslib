import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, PostHandlers } from "./api-type";
import { Post } from "./entity";
import {
  createPost,
  deletePost,
  fetchAllPosts,
  fetchPostById,
  fetchPostsByChannel,
  fetchPostsByMediaPath,
  fetchPostsBySchedule,
  updatePost,
} from "./operations";

export const handlers: PostHandlers = {
  create: (_, data) => createPost(data, []),
  getAll: (_) => fetchAllPosts(),
  bySchedule: (_, scheduleId: string) => fetchPostsBySchedule(scheduleId),
  byChannel: (_, channelId: string) => fetchPostsByChannel(channelId),
  byMediaPath: (_, mediaPath: string) => fetchPostsByMediaPath(mediaPath),
  update: (_, id: string, updates: Partial<Post>, newMediaPathsInOrder?: string[]) =>
    updatePost(id, updates, newMediaPathsInOrder),
  markAsScheduled: (_, id: string) => updatePost(id, { status: "scheduled" }),
  markAsPosted: (_, id: string) => updatePost(id, { status: "planned" }),
  markAsPlanned: (_, id: string) => updatePost(id, { status: "posted" }),
  delete: (_, id) => deletePost(id),
  addMedia: (_, postId: string, mediaPaths: string[]) => updatePost(postId, {}, mediaPaths),
  removeMedia: async (_, postId: string, mediaToRemove: string[]) => {
    const post = await fetchPostById(postId);
    if (!post) return null;
    return updatePost(
      postId,
      {},
      post?.media.filter((m) => !mediaToRemove.includes(m.path)).map((m) => m.path)
    );
  },
};

export const postHandlers = prefixNamespaceObject(namespace, handlers);
