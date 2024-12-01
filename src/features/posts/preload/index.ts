import { ipcRenderer } from "electron";
import { PostsAPI } from "../types";

export const postsBridge: PostsAPI = {
  createPost: (data) => ipcRenderer.invoke("post:create", data),
  getAllPosts: () => ipcRenderer.invoke("post:get-all"),
  getPostsBySchedule: (scheduleId) => ipcRenderer.invoke("post:get-by-schedule", scheduleId),
  getPostsByChannel: (channelId) => ipcRenderer.invoke("post:get-by-channel", channelId),
  getScheduledPosts: () => ipcRenderer.invoke("post:get-scheduled"),
  updatePost: (id, updates) => ipcRenderer.invoke("post:update", id, updates),

  markPostAsPosted: (id) => ipcRenderer.invoke("post:mark-posted", id),

  deletePost: (id) => ipcRenderer.invoke("post:delete", id),

  // Media management methods
  addMediaToPost: (postId, mediaPaths) => ipcRenderer.invoke("post:add-media", postId, mediaPaths),

  removeMediaFromPost: (postId, mediaPaths) =>
    ipcRenderer.invoke("post:remove-media", postId, mediaPaths),

  reorderPostMedia: (postId, mediaOrder) =>
    ipcRenderer.invoke("post:reorder-media", postId, mediaOrder),
  getByMediaPath: (mediaPath) => ipcRenderer.invoke("posts:get-by-media-path", mediaPath),
};
