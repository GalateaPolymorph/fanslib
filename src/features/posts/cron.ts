import { LessThan } from "typeorm";
import { db } from "../../lib/db";
import { sendNotification } from "../notifications/api";
import { Post } from "./entity";

export const updateScheduledPosts = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Post);

  const now = new Date().toISOString();

  // Find all scheduled posts that are in the past
  const scheduledPosts = await repository.find({
    where: {
      status: "scheduled",
      date: LessThan(now),
    },
  });

  if (!scheduledPosts.length) {
    return;
  }

  // Update all found posts to "posted" status
  await repository.update(
    scheduledPosts.map((post) => post.id),
    { status: "posted", updatedAt: now }
  );

  // Send notification
  sendNotification({
    title: "Posts Published",
    body: `${scheduledPosts.length} post${scheduledPosts.length === 1 ? "" : "s"} automatically published`,
  });
};
