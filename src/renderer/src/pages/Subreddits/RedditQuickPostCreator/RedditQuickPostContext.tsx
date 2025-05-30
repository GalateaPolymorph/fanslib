import { channelKeys, useChannels } from "@renderer/hooks/api/useChannels";
import { useCreatePost } from "@renderer/hooks/api/usePost";
import { useRedgifsLookup } from "@renderer/hooks/api/useRedgifsUrl";
import {
  subredditLastPostDateKeys,
  useSubredditLastPostDates,
} from "@renderer/hooks/api/useSubredditLastPostDates";
import { useMediaSelector } from "@renderer/hooks/business/useFilteredRandomMedia";
import { useCaptionGenerator } from "@renderer/hooks/business/useMediaCaption";
import { useSubredditSelector } from "@renderer/hooks/business/useOptimalSubreddit";
import { useRedditUrlGenerator } from "@renderer/hooks/business/useRedditUrlGenerator";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { CHANNEL_TYPES } from "../../../../../features/channels/channelTypes";
import { Subreddit } from "../../../../../features/channels/subreddit";
import { Media } from "../../../../../features/library/entity";
import { GenerationError, PostState } from "./types";

type RedditQuickPostContextType = {
  postState: PostState;

  // Essential computed values
  lastPostDates: Record<string, string>;
  subreddits: Subreddit[];

  // Simplified actions
  generateRandomPost: () => Promise<void>;
  updateCaption: (caption: string) => void;
  selectSpecificMedia: (media: Media) => void;
  refreshPost: () => Promise<void>;
  refreshMedia: () => Promise<void>;
  refreshRedgifsUrl: () => Promise<void>;
  markAsPosted: () => Promise<void>;

  openRedditPost: () => void;
  openMediaInFinder: () => void;
  copyMediaNameToClipboard: () => void;
};

const RedditQuickPostContext = createContext<RedditQuickPostContextType | null>(null);

export const useRedditQuickPostContext = () => {
  const context = useContext(RedditQuickPostContext);
  if (!context) {
    throw new Error("useRedditQuickPostContext must be used within a RedditQuickPostProvider");
  }
  return context;
};

export { RedditQuickPostContext };

const removeHashtagsFromEnd = (caption: string): string => {
  return caption
    .replace(/(\n\s*#[^\n]*)+$/g, "")
    .replace(/(^|\s)(#\w+\s*)+$/g, "$1")
    .replace(/\n+$/, "");
};

type RedditQuickPostProviderProps = {
  children: ReactNode;
  subreddits: Subreddit[];
};

export const RedditQuickPostProvider = ({ children, subreddits }: RedditQuickPostProviderProps) => {
  const [postState, setPostState] = useState<PostState>({
    subreddit: null,
    media: null,
    caption: "",
    redgifsUrl: null,
    isLoading: false,
    error: null,
    isUrlReady: false,
    totalMediaAvailable: 0,
    hasPostedToReddit: false,
  });

  // Function provider hooks
  const { selectOptimalSubreddit } = useSubredditSelector(subreddits);
  const { selectRandomMedia } = useMediaSelector();
  const { generateCaption } = useCaptionGenerator();
  const { lookupRedgifsUrl } = useRedgifsLookup();
  const createPostMutation = useCreatePost();
  const queryClient = useQueryClient();

  // Essential computed data
  const subredditIds = subreddits.map((s) => s.id);
  const { data: lastPostDates = {} } = useSubredditLastPostDates(subredditIds);
  const { data: channels = [] } = useChannels();

  // URL generator for current state - only used for generating URLs, not for state management
  const { generateUrl } = useRedditUrlGenerator({
    subreddit: postState.subreddit,
    media: postState.media,
    caption: postState.caption,
    redgifsUrl: postState.redgifsUrl,
    isRedgifsLoading: false,
  });

  const updateCaption = useCallback((caption: string) => {
    const cleanedCaption = removeHashtagsFromEnd(caption);
    setPostState((prev) => ({ ...prev, caption: cleanedCaption }));
  }, []);

  const generateRandomPost = useCallback(async (): Promise<void> => {
    if (subreddits.length === 0) {
      return;
    }

    setPostState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Step 1: Select optimal subreddit
      const subreddit = await selectOptimalSubreddit();
      if (!subreddit) {
        throw new Error("No eligible subreddit found");
      }

      // Step 2: Select random media for the subreddit
      const { media, totalAvailable } = await selectRandomMedia(subreddit.eligibleMediaFilter);
      if (!media) {
        throw new Error("No media found for the selected subreddit");
      }

      // Step 3: Generate caption and RedGIFs URL in parallel
      const [caption, redgifsUrl] = await Promise.all([
        generateCaption(media),
        media.type === "video" ? lookupRedgifsUrl(media) : Promise.resolve(null),
      ]);

      const cleanedCaption = removeHashtagsFromEnd(caption);

      // Update state with all generated data
      setPostState({
        subreddit,
        media,
        caption: cleanedCaption,
        redgifsUrl,
        isLoading: false,
        error: null,
        isUrlReady: true,
        totalMediaAvailable: totalAvailable,
        hasPostedToReddit: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const generationError: GenerationError = {
        type: "general",
        message: `Failed to generate quick post: ${errorMessage}`,
        retryable: true,
      };

      setPostState((prev) => ({
        ...prev,
        isLoading: false,
        error: generationError,
      }));
    }
  }, [subreddits, selectOptimalSubreddit, selectRandomMedia, generateCaption, lookupRedgifsUrl]);

  const refreshPost = useCallback(async (): Promise<void> => {
    await generateRandomPost();
  }, [generateRandomPost]);

  const refreshMedia = useCallback(async (): Promise<void> => {
    if (!postState.subreddit) {
      return;
    }

    setPostState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Step 1: Use current subreddit
      const currentSubreddit = postState.subreddit;

      // Step 2: Select new random media for the current subreddit
      const { media, totalAvailable } = await selectRandomMedia(
        currentSubreddit.eligibleMediaFilter
      );
      if (!media) {
        throw new Error("No media found for the current subreddit");
      }

      // Step 3: Generate caption and RedGIFs URL in parallel for the new media
      const [caption, redgifsUrl] = await Promise.all([
        generateCaption(media),
        media.type === "video" ? lookupRedgifsUrl(media) : Promise.resolve(null),
      ]);

      const cleanedCaption = removeHashtagsFromEnd(caption);

      // Update state with new media data, keeping the same subreddit
      setPostState((prev) => ({
        ...prev,
        media,
        caption: cleanedCaption,
        redgifsUrl,
        isLoading: false,
        error: null,
        isUrlReady: true,
        totalMediaAvailable: totalAvailable,
        hasPostedToReddit: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const generationError: GenerationError = {
        type: "general",
        message: `Failed to refresh media: ${errorMessage}`,
        retryable: true,
      };

      setPostState((prev) => ({
        ...prev,
        isLoading: false,
        error: generationError,
      }));
    }
  }, [postState.subreddit, selectRandomMedia, generateCaption, lookupRedgifsUrl]);

  // Initial load effect - generate a post when component mounts
  useEffect(() => {
    if (subreddits.length > 0 && !postState.subreddit && !postState.isLoading) {
      generateRandomPost();
    }
  }, [subreddits.length, generateRandomPost, postState.subreddit, postState.isLoading]);

  const selectSpecificMedia = useCallback((media: Media) => {
    setPostState((prev) => ({ ...prev, media }));
  }, []);

  const openRedditPost = useCallback(() => {
    try {
      const url = generateUrl();
      if (!url) {
        return;
      }

      window.open(url, "_blank", "noopener,noreferrer");

      // Mark as posted to Reddit when URL is successfully opened
      setPostState((prev) => ({ ...prev, hasPostedToReddit: true }));

      // Also reveal image in Finder if the selected media is an image
      if (postState.media && postState.media.type === "image") {
        try {
          window.api["os:revealInFinder"](postState.media.path);
        } catch (_error) {
          console.warn("Failed to reveal image in Finder:", _error);
        }
      }
    } catch (_error) {
      // Silent error handling
    }
  }, [generateUrl, postState.media]);

  const openRedgifsUrl = useCallback(() => {
    try {
      if (!postState.redgifsUrl) {
        return;
      }

      window.open(postState.redgifsUrl, "_blank", "noopener,noreferrer");
    } catch (_error) {
      // Silent error handling
    }
  }, [postState.redgifsUrl]);

  const openMediaInFinder = useCallback(() => {
    if (!postState.media) {
      return;
    }

    try {
      window.api["os:revealInFinder"](postState.media.path);
    } catch (_error) {
      // Silent error handling
    }
  }, [postState.media]);

  const copyMediaNameToClipboard = useCallback(() => {
    if (!postState.media) {
      return;
    }

    try {
      window.api["os:copyToClipboard"](postState.media.name);
    } catch (_error) {
      // Silent error handling
    }
  }, [postState.media]);

  const markAsPosted = useCallback(async (): Promise<void> => {
    if (!postState.subreddit || !postState.media || !postState.caption.trim()) {
      throw new Error("Missing required data to create post");
    }

    // Find the Reddit channel
    const redditChannel = channels.find((c) => c.type.id === CHANNEL_TYPES.reddit.id);
    if (!redditChannel) {
      throw new Error("Reddit channel not found. Please set up a Reddit channel first.");
    }

    try {
      await createPostMutation.mutateAsync({
        postData: {
          date: new Date().toISOString(),
          channelId: redditChannel.id,
          status: "posted",
          caption: postState.caption,
          subredditId: postState.subreddit.id,
        },
        mediaIds: [postState.media.id],
      });

      // Generate a new random post after successfully creating the post
      await generateRandomPost();

      // Invalidate subreddit queries
      queryClient.invalidateQueries({ queryKey: channelKeys.subreddits });
      queryClient.invalidateQueries({
        queryKey: subredditLastPostDateKeys.lastPostDates(subredditIds),
      });
    } catch (error) {
      throw new Error(
        `Failed to create post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }, [
    postState.subreddit,
    postState.media,
    postState.caption,
    channels,
    createPostMutation,
    generateRandomPost,
    queryClient,
    subredditIds,
  ]);

  const refreshRedgifsUrl = useCallback(async (): Promise<void> => {
    if (!postState.media) {
      return;
    }

    setPostState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Step 1: Generate new RedGIFs URL for the current media
      const redgifsUrl = await lookupRedgifsUrl(postState.media);

      // Update state with new RedGIFs URL
      setPostState((prev) => ({
        ...prev,
        redgifsUrl,
        isLoading: false,
        error: null,
        isUrlReady: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const generationError: GenerationError = {
        type: "general",
        message: `Failed to refresh RedGIFs URL: ${errorMessage}`,
        retryable: true,
      };

      setPostState((prev) => ({
        ...prev,
        isLoading: false,
        error: generationError,
      }));
    }
  }, [postState.media, lookupRedgifsUrl]);

  const contextValue = {
    // Unified state
    postState,

    // Essential computed values
    lastPostDates,
    subreddits,

    // Simplified actions
    generateRandomPost,
    updateCaption,
    selectSpecificMedia,
    refreshPost,
    refreshMedia,
    refreshRedgifsUrl,
    markAsPosted,

    // Legacy actions for compatibility
    openRedditPost,
    openRedgifsUrl,
    openMediaInFinder,
    copyMediaNameToClipboard,
  };

  return (
    <RedditQuickPostContext.Provider value={contextValue}>
      {children}
    </RedditQuickPostContext.Provider>
  );
};
