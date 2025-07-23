import { 
  FindRedgifsUrlQuery, 
  FindRedgifsUrlQueryVariables,
  FindSubredditPostingTimesQuery,
  FindSubredditPostingTimesQueryVariables 
} from "src/graphql/postpone/types";
import { db } from "../../lib/db";
import { CHANNEL_TYPES } from "../channels/channelTypes";
import { Media } from "../library/entity";
import { Post } from "../posts/entity";
import { loadSettings } from "../settings/load";
import { FindRedgifsURLPayload, RefreshRedgifsURLPayload, PostponeBlueskyDraftPayload, FindSubredditPostingTimesPayload } from "./api-type";
import { fetchPostpone } from "./fetch";
import { FIND_REDGIFS_URL } from "./gql/find-redgifs-url";
import { FIND_SUBREDDIT_POSTING_TIMES } from "./gql/find-subreddit-posting-times";
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

  // Prepare thread submission with expiry settings
  const threadSubmission = {
    text: post.caption,
    order: 1,
    contentWarning: "PORN",
    languages: ["en"],
    mediaName: media?.media.name,
    // Add expiry settings if configured
    ...(settings.blueskyDefaultExpiryDays && {
      removeAtAmount: settings.blueskyDefaultExpiryDays,
      removeAtUnit: "day",
    }),
  };

  return fetchPostpone<{ scheduleBlueskyPost: { success: boolean } }>(SCHEDULE_BLUESKY_POST, {
    input: {
      username: settings.blueskyUsername,
      postAt: new Date(post.date).toISOString(),
      publishingStatus: "DRAFT",
      thread: [threadSubmission],
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

  // Check if we have a cached URL first
  if (media.redgifsUrl) {
    return { url: media.redgifsUrl };
  }

  // If no cached URL, fetch from Postpone API
  return fetchPostpone<FindRedgifsUrlQuery, FindRedgifsUrlQueryVariables>(FIND_REDGIFS_URL, {
    filename: media.name,
  }).then(async (result) => {
    const postponeMedia = result.media.objects[0];
    if (!postponeMedia) return { url: null };

    const isRedgifsUrl = postponeMedia.hostedUrl.includes("redgifs.com");
    if (!isRedgifsUrl) return { url: null };

    const url = postponeMedia.hostedUrl ?? null;

    // Cache the successful result in the database
    if (url) {
      await mediaRepository.update(media.id, { redgifsUrl: url });
    }

    return { url };
  });
};

export const refreshRedgifsURL = async (data: RefreshRedgifsURLPayload) => {
  const dataSource = await db();
  const mediaRepository = dataSource.getRepository(Media);
  const media = await mediaRepository.findOne({ where: { id: data.mediaId } });

  if (!media) {
    throw new Error(`Media with id ${data.mediaId} not found`);
  }

  // Clear the cached URL first
  await mediaRepository.update(media.id, { redgifsUrl: null });

  // Fetch fresh URL from Postpone API
  return fetchPostpone<FindRedgifsUrlQuery, FindRedgifsUrlQueryVariables>(FIND_REDGIFS_URL, {
    filename: media.name,
  }).then(async (result) => {
    const postponeMedia = result.media.objects[0];
    if (!postponeMedia) return { url: null };

    const isRedgifsUrl = postponeMedia.hostedUrl.includes("redgifs.com");
    if (!isRedgifsUrl) return { url: null };

    const url = postponeMedia.hostedUrl ?? null;

    // Cache the fresh result in the database
    if (url) {
      await mediaRepository.update(media.id, { redgifsUrl: url });
    }

    return { url };
  });
};

export const findSubredditPostingTimes = async (data: FindSubredditPostingTimesPayload) => {
  const timezone = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const result = await fetchPostpone<FindSubredditPostingTimesQuery, FindSubredditPostingTimesQueryVariables>(
    FIND_SUBREDDIT_POSTING_TIMES, 
    {
      subreddit: data.subreddit,
      timezone
    }
  );

  if (!result.analytics?.posts) {
    return {
      postingTimes: [],
      subreddit: data.subreddit,
      timezone
    };
  }

  // Normalize scores to 1-100 scale
  const posts = result.analytics.posts.filter(p => p?.day !== null && p?.hour !== null && p?.posts !== null);
  const maxPosts = Math.max(...posts.map(p => p!.posts!));
  
  const postingTimes = posts.map(p => ({
    day: p!.day!,
    hour: p!.hour!,
    posts: p!.posts!,
    score: maxPosts > 0 ? Math.round((p!.posts! / maxPosts) * 100) : 0
  }));

  return {
    postingTimes,
    subreddit: data.subreddit,
    timezone
  };
};
