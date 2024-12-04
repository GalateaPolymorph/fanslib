import { ipcMain } from "electron";
import { createPost } from "../../../lib/database/posts/create";
import { deletePost } from "../../../lib/database/posts/delete";
import {
  getAllPosts,
  getPostsByChannel,
  getPostsBySchedule,
} from "../../../lib/database/posts/fetch";
import {
  addMediaToPost,
  removeMediaFromPost,
  reorderPostMedia,
} from "../../../lib/database/posts/media";
import { updatePost } from "../../../lib/database/posts/update";

export const registerPostsHandlers = () => {
  ipcMain.handle("posts:create", async (_, data) => {
    return createPost({ ...data, status: "planned" });
  });

  ipcMain.handle("posts:get-all", async () => {
    return getAllPosts();
  });

  ipcMain.handle("posts:get-by-schedule", async (_, scheduleId: string) => {
    return getPostsBySchedule(scheduleId);
  });

  ipcMain.handle("posts:get-by-channel", async (_, channelId: string) => {
    return getPostsByChannel(channelId);
  });

  ipcMain.handle("posts:update", async (_, id: string, updates) => {
    return updatePost(id, updates);
  });

  ipcMain.handle("posts:mark-as-scheduled", async (_, id: string) => {
    return updatePost(id, { status: "scheduled" });
  });

  ipcMain.handle("posts:mark-as-posted", async (_, id: string) => {
    return updatePost(id, { status: "posted" });
  });

  ipcMain.handle("posts:mark-as-planned", async (_, id: string) => {
    return updatePost(id, { status: "planned" });
  });

  ipcMain.handle("posts:delete", async (_, id: string) => {
    await deletePost(id);
  });

  ipcMain.handle("posts:get-by-media-path", async (_, mediaPath: string) => {
    const posts = await getAllPosts();
    return posts.filter((post) => post.mediaIds.some((mediaId) => mediaId.path === mediaPath));
  });

  // Media management handlers
  ipcMain.handle("posts:add-media", async (_, postId: string, mediaPaths: string[]) => {
    return addMediaToPost(postId, mediaPaths);
  });

  ipcMain.handle("posts:remove-media", async (_, postId: string, mediaPaths: string[]) => {
    return removeMediaFromPost(postId, mediaPaths);
  });

  ipcMain.handle(
    "posts:reorder-media",
    async (_, postId: string, order: { path: string; order: number }[]) => {
      return reorderPostMedia(postId, order);
    }
  );
};
