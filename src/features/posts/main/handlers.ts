import { ipcMain } from "electron";
import { createPost } from "../../../lib/database/posts/create";
import { deletePost } from "../../../lib/database/posts/delete";
import {
  getAllPosts,
  getPostsByChannel,
  getPostsByMediaPath,
  getPostsBySchedule,
  getScheduledPosts,
} from "../../../lib/database/posts/fetch";
import {
  addMediaToPost,
  removeMediaFromPost,
  reorderPostMedia,
} from "../../../lib/database/posts/media";
import { RawPost } from "../../../lib/database/posts/type";
import { markPostAsPosted, updatePost } from "../../../lib/database/posts/update";

export const registerPostsHandlers = () => {
  ipcMain.handle(
    "post:create",
    async (_, data: Omit<RawPost, "id" | "createdAt" | "updatedAt">) => {
      return createPost(data);
    }
  );

  ipcMain.handle("post:get-all", async () => {
    return getAllPosts();
  });

  ipcMain.handle("post:get-by-schedule", async (_, scheduleId: string) => {
    return getPostsBySchedule(scheduleId);
  });

  ipcMain.handle("post:get-by-channel", async (_, channelId: string) => {
    return getPostsByChannel(channelId);
  });

  ipcMain.handle("post:get-scheduled", async () => {
    return getScheduledPosts();
  });

  ipcMain.handle("post:update", async (_, id: string, updates: Partial<RawPost>) => {
    return updatePost(id, updates);
  });

  ipcMain.handle("post:mark-posted", async (_, id: string) => {
    return markPostAsPosted(id);
  });

  ipcMain.handle("post:delete", async (_, id: string) => {
    return deletePost(id);
  });

  // Media management handlers
  ipcMain.handle("post:add-media", async (_, postId: string, paths: string[]) => {
    return addMediaToPost(postId, paths);
  });

  ipcMain.handle("post:remove-media", async (_, postId: string, paths: string[]) => {
    return removeMediaFromPost(postId, paths);
  });

  ipcMain.handle(
    "post:reorder-media",
    async (_, postId: string, mediaOrder: { path: string; order: number }[]) => {
      return reorderPostMedia(postId, mediaOrder);
    }
  );
  ipcMain.handle("posts:get-by-media-path", async (_event, mediaPath: string) => {
    return getPostsByMediaPath(mediaPath);
  });
};
