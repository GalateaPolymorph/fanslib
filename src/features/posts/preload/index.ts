import { ipcRenderer } from "electron";
import { Post, RawPost } from "../../../lib/database/posts/type";

export const postsBridge = {
  createPost: (data: Omit<RawPost, "id" | "createdAt" | "updatedAt">) =>
    ipcRenderer.invoke("post:create", data) as Promise<Post>,

  getAllPosts: () => ipcRenderer.invoke("post:get-all") as Promise<Post[]>,

  getPostsBySchedule: (scheduleId: string) =>
    ipcRenderer.invoke("post:get-by-schedule", scheduleId) as Promise<Post[]>,

  getPostsByChannel: (channelId: string) =>
    ipcRenderer.invoke("post:get-by-channel", channelId) as Promise<Post[]>,

  getScheduledPosts: () => ipcRenderer.invoke("post:get-scheduled") as Promise<Post[]>,

  updatePost: (id: string, updates: Partial<RawPost>) =>
    ipcRenderer.invoke("post:update", id, updates) as Promise<Post>,

  markPostAsPosted: (id: string) => ipcRenderer.invoke("post:mark-posted", id) as Promise<Post>,

  deletePost: (id: string) => ipcRenderer.invoke("post:delete", id),

  // Media management methods
  addMediaToPost: (postId: string, paths: string[]) =>
    ipcRenderer.invoke("post:add-media", postId, paths) as Promise<Post>,

  removeMediaFromPost: (postId: string, paths: string[]) =>
    ipcRenderer.invoke("post:remove-media", postId, paths) as Promise<Post>,

  reorderPostMedia: (postId: string, mediaOrder: { path: string; order: number }[]) =>
    ipcRenderer.invoke("post:reorder-media", postId, mediaOrder) as Promise<Post>,
  getByMediaPath: (mediaPath: string) => ipcRenderer.invoke("posts:get-by-media-path", mediaPath),
};
