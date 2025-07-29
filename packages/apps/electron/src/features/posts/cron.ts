import { LessThan } from "typeorm";
import { db } from "../../lib/db";
import { sendNotification } from "../notifications/api";
import { syncStatusFromServer } from "../server-communication";
import { Post } from "./entity";
import { CHANNEL_TYPES } from "../channels/channelTypes";

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

export const syncRedditQueueStatus = async () => {
  // Sync status updates from server for any existing jobs
  await syncStatusFromServer();
};

export const updateScheduledPosts = async () => {
  // Handle non-Reddit posts by marking them as posted
  await updateScheduledNonRedditPosts();

  // Sync Reddit queue status from server
  await syncRedditQueueStatus();
};
