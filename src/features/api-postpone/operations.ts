import { db } from "../../lib/db";
import { CHANNEL_TYPES } from "../channels/channelTypes";
import { Post } from "../posts/entity";
import { loadSettings } from "../settings/load";
import { PostponeBlueskyDraftPayload } from "./api-type";

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
    relations: ["channel"],
  });

  if (!post) {
    throw new Error(`Post with id ${data.postId} not found`);
  }

  // Ensure this is a Bluesky post
  if (post.channel.typeId !== CHANNEL_TYPES.bluesky.id) {
    throw new Error("Post is not for Bluesky channel");
  }

  // Prepare the GraphQL mutation
  const mutation = `
    mutation ScheduleBlueskyPost($input: ScheduleBlueskyPostInput!) {
      scheduleBlueskyPost(input: $input) {
        success
      }
    }
  `;

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
        },
      ],
    },
  };

  // Make the GraphQL request to Postpone API
  const response = await fetch("https://api.postpone.app/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.postponeToken}`,
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create Bluesky draft: ${response.statusText}`);
    console.error(response);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  return {
    success: result.data.scheduleBlueskyPost.success,
  };
};
