import { Post, PostMedia } from "../features/posts/entity";
import { db } from "../lib/db";

const POST_FIXTURES: Omit<
  Post,
  "createdAt" | "updatedAt" | "media" | "channel" | "fanslyAnalyticsDatapoints" | "postMedia"
>[] = [
  {
    id: "post-001",
    caption:
      "Casual Studio Vibes ✨ Had such a fun time in the studio today! Natural lighting hits different 📸 #studio #casual #naturallight",
    status: "posted" as const,
    date: new Date("2024-01-10T12:00:00Z").toISOString(),
    channelId: "fansly",
    fypRemovedAt: null,
  },
  {
    id: "post-002",
    caption:
      "Summer Outdoor Session 🌞 Golden hour magic! Love shooting outdoors when the weather is perfect ☀️ #outdoor #summer #goldenhour",
    status: "posted" as const,
    date: new Date("2024-01-12T18:00:00Z").toISOString(),
    channelId: "fansly",
    fypRemovedAt: null,
  },
  {
    id: "post-003",
    caption:
      "Lingerie Collection Preview 💋 New lingerie pieces just arrived! Which one is your favorite? 😍 #lingerie #collection #elegant",
    status: "posted" as const,
    date: new Date("2024-01-15T21:00:00Z").toISOString(),
    channelId: "fansly",
    fypRemovedAt: null,
  },
  {
    id: "post-004",
    caption:
      "Workout Motivation Monday 💪 Starting the week strong! Who's joining me for a workout? 🏋️‍♀️ #workout #fitness #motivation",
    status: "posted" as const,
    date: new Date("2024-01-18T08:00:00Z").toISOString(),
    channelId: "fansly",
    fypRemovedAt: null,
  },
];

export const loadPostFixtures = async () => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);
  const postMediaRepository = dataSource.getRepository(PostMedia);

  // Load Post entities
  const existingPosts = await postRepository.find();

  const postPromises = POST_FIXTURES.map(async (postData) => {
    const { postMedia, ...post } = postData;

    if (existingPosts.find((p) => p.id === post.id)) {
      return null;
    }

    const savedPost = await postRepository.save(post);

    // Create PostMedia associations
    if (mediaIds && mediaIds.length > 0) {
      const mediaPromises = mediaIds.map(async (mediaId, index) => {
        const existingPostMedia = await postMediaRepository.findOne({
          where: {
            post: { id: savedPost.id },
            media: { id: mediaId },
          },
        });

        if (!existingPostMedia) {
          return postMediaRepository.save({
            post: savedPost,
            media: { id: mediaId },
            order: index,
          });
        }
        return null;
      });

      await Promise.all(mediaPromises);
    }

    return savedPost;
  });

  await Promise.all(postPromises);
};
