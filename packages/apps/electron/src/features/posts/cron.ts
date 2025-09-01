import { LessThan } from "typeorm";
import { db } from "../../lib/db";
import { CHANNEL_TYPES } from "../channels/channelTypes";
import { sendNotification } from "../notifications/api";
import { syncStatusFromServer } from "../server-communication";
import { syncCompletedJobs } from "../server-communication/post-sync";
import { Post } from "./entity";

export const updateScheduledNonRedditPosts = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  const now = new Date().toISOString();

  // Find all scheduled posts that are in the past and are NOT Reddit posts
  const scheduledNonRedditPosts = await repository.find({
    where: {
      status: "scheduled",
      date: LessThan(now),
    },
    relations: ["channel", "channel.type"],
  });

  // Filter out Reddit posts
  const nonRedditPosts = scheduledNonRedditPosts.filter(
    (post) => post.channel?.type?.id !== CHANNEL_TYPES.reddit.id
  );

  if (!nonRedditPosts.length) {
    return;
  }

  // Update all non-Reddit posts to "posted" status
  await repository.update(
    nonRedditPosts.map((post) => post.id),
    { status: "posted", updatedAt: now }
  );

  // Send notification
  sendNotification({
    title: "Posts Published",
    body: `${nonRedditPosts.length} post${nonRedditPosts.length === 1 ? "" : "s"} automatically published`,
  });
};

export const updateScheduledPosts = async () => {
  await updateScheduledNonRedditPosts();
  await syncStatusFromServer();
  
  // Sync completed Reddit jobs from server and create local posts
  try {
    const createdCount = await syncCompletedJobs();
    if (createdCount > 0) {
      sendNotification({
        title: "Reddit Posts Synced",
        body: `${createdCount} Reddit post${createdCount === 1 ? "" : "s"} synced from server`,
      });
    }
  } catch (error) {
    console.error("❌ Failed to sync completed Reddit jobs:", error);
  }
};
