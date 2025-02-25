import { print } from "graphql";
import { db } from "../../lib/db";
import { CHANNEL_TYPES } from "../channels/channelTypes";
import { Post } from "../posts/entity";
import { loadSettings } from "../settings/load";
import { PostponeBlueskyDraftPayload } from "./api-type";
import { SCHEDULE_BLUESKY_POST } from "./gql/schedule-bluesky-post";

export const draftBlueskyPost = async (data: PostponeBlueskyDraftPayload) => {
  // Get database connection
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);

  // Load settings to get Bluesky credentials
  const settings = await loadSettings();

  if (!settings.blueskyUsername || !settings.postponeToken) {
    throw new Error("Bluesky credentials not configured. Please add them in Settings.");
  }

  // Fetch post with all relations
  const post = await postRepository.findOne({
    where: { id: data.postId },
    relations: {
      channel: true,
      postMedia: {
        media: true,
      },
    },
  });

  if (!post) {
    throw new Error(`Post with id ${data.postId} not found`);
  }

  // Ensure this is a Bluesky post
  if (post.channel.typeId !== CHANNEL_TYPES.bluesky.id) {
    throw new Error("Post is not for Bluesky channel");
  }

  const media = post.postMedia[0];

  // Prepare the variables for the mutation
  const variables = {
    input: {
      username: settings.blueskyUsername,
      postAt: new Date(post.date).toISOString(),
      publishingStatus: "DRAFT",
      thread: [
        {
          text: post.caption,
          order: 1,
          contentWarning: "PORN",
          languages: ["en"],
          mediaName: media?.media.name,
        },
      ],
    },
  };

  const body = JSON.stringify({
    query: print(SCHEDULE_BLUESKY_POST),
    variables,
  });

  console.log(body);

  // Make the GraphQL request to Postpone API
  const response = await fetch("https://api.postpone.app/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.postponeToken}`,
    },
    body,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  return {
    success: result.data.scheduleBlueskyPost.success,
  };
};
