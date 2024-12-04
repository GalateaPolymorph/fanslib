import { ipcRenderer } from "electron";
import { PostsAPI } from "../types";

export const postsBridge: PostsAPI = {
  createPost: (data) => ipcRenderer.invoke("posts:create", data),
  getAllPosts: () => ipcRenderer.invoke("posts:get-all"),
  getPostsBySchedule: (scheduleId) => ipcRenderer.invoke("posts:get-by-schedule", scheduleId),
  getPostsByChannel: (channelId) => ipcRenderer.invoke("posts:get-by-channel", channelId),
  getByMediaPath: (mediaPath) => ipcRenderer.invoke("posts:get-by-media-path", mediaPath),
  updatePost: (id, updates) => ipcRenderer.invoke("posts:update", id, updates),
  markAsPosted: (id) => ipcRenderer.invoke("posts:mark-as-posted", id),
  markAsPlanned: (id) => ipcRenderer.invoke("posts:mark-as-planned", id),
  markAsScheduled: (id) => ipcRenderer.invoke("posts:mark-as-scheduled", id),
  deletePost: (id) => ipcRenderer.invoke("posts:delete", id),
  addMediaToPost: (postId, mediaPaths) => ipcRenderer.invoke("posts:add-media", postId, mediaPaths),
  removeMediaFromPost: (postId, mediaPaths) =>
    ipcRenderer.invoke("posts:remove-media", postId, mediaPaths),
  reorderPostMedia: (postId, mediaPath, newOrder) =>
    ipcRenderer.invoke("posts:reorder-media", postId, mediaPath, newOrder),
};
