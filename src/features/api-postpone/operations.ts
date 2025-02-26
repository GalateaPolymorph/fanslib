import { FindRedgifsUrlQuery, FindRedgifsUrlQueryVariables } from "src/graphql/postpone/types";
import { db } from "../../lib/db";
import { CHANNEL_TYPES } from "../channels/channelTypes";
import { Media } from "../library/entity";
import { Post } from "../posts/entity";
import { loadSettings } from "../settings/load";
import { FindRedgifsURLPayload, PostponeBlueskyDraftPayload } from "./api-type";
import { fetchPostpone } from "./fetch";
import { FIND_REDGIFS_URL } from "./gql/find-redgifs-url";
import { SCHEDULE_BLUESKY_POST } from "./gql/schedule-bluesky-post";

export const draftBlueskyPost = async (data: PostponeBlueskyDraftPayload) => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);

  const settings = await loadSettings();
  if (!settings.blueskyUsername) {
    throw new Error("Bluesky username not configured. Please add it in Settings.");
  }

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

  if (post.channel.typeId !== CHANNEL_TYPES.bluesky.id) {
    throw new Error("Post is not for Bluesky channel");
  }

  const media = post.postMedia[0];

  return fetchPostpone<{ scheduleBlueskyPost: { success: boolean } }>(SCHEDULE_BLUESKY_POST, {
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
  }).then((result) => ({ success: result.scheduleBlueskyPost.success }));
};

export const findRedgifsURL = async (data: FindRedgifsURLPayload) => {
  const dataSource = await db();
  const mediaRepository = dataSource.getRepository(Media);
  const media = await mediaRepository.findOne({ where: { id: data.mediaId } });

  if (!media) {
    throw new Error(`Media with id ${data.mediaId} not found`);
  }

  return fetchPostpone<FindRedgifsUrlQuery, FindRedgifsUrlQueryVariables>(FIND_REDGIFS_URL, {
    filename: media.name,
  }).then((result) => {
    const media = result.media.objects[0];
    if (!media) return { url: null };

    const isRedgifsUrl = media.hostedUrl.includes("redgifs.com");
    if (!isRedgifsUrl) return { url: null };

    return { url: media.hostedUrl ?? null };
  });
};
