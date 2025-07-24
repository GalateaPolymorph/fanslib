import { db } from "../../lib/db";
import { Post } from "./entity";

export const migrateFypPromotionToFypRemovedAt = async (): Promise<void> => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);

  console.log("Starting migration from fypPromotion to fypRemovedAt...");

  // Get all posts that need migration
  const posts = await postRepository.find({
    where: {},
    relations: { channel: true },
  });

  console.log(`Found ${posts.length} posts to migrate`);

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  let migrationCount = 0;
  const batchSize = 100;

  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    const updates = batch.map((post) => {
      const postDate = new Date(post.date);

      // For posts < 90 days old, set fypRemovedAt = null (active on FYP)
      if (postDate >= ninetyDaysAgo) {
        return {
          id: post.id,
          fypRemovedAt: null,
        };
      } else {
        // For posts ≥ 90 days old, set fypRemovedAt = postedDate + 90 days
        const removalDate = new Date(postDate);
        removalDate.setDate(removalDate.getDate() + 90);

        return {
          id: post.id,
          fypRemovedAt: removalDate,
        };
      }
    });

    // Update the batch
    await Promise.all(
      updates.map(async (update) => {
        await postRepository.update(update.id, { fypRemovedAt: update.fypRemovedAt });
        migrationCount++;
      })
    );

    console.log(`Migrated ${Math.min(i + batchSize, posts.length)} / ${posts.length} posts`);
  }

  console.log(`Migration completed! Updated ${migrationCount} posts`);
};

export const runFYPPromotionMigrationIfNeeded = async (): Promise<void> => {
  const dataSource = await db();

  // Check if migration is needed by looking for posts that still have the old schema
  // This is a simple check - in a real app, you'd want a more sophisticated migration tracking system
  const samplePost = await dataSource.getRepository(Post).findOne({
    where: {},
    select: ["id", "fypRemovedAt"],
  });

  if (samplePost) {
    // Check if the field exists and has been migrated
    // If fypRemovedAt is undefined for existing posts, we need to migrate
    const needsMigration = samplePost.fypRemovedAt === undefined;

    if (needsMigration) {
      await migrateFypPromotionToFypRemovedAt();
    } else {
      console.log("Migration already completed or not needed");
    }
  }
};
