import { useSettings } from "@renderer/contexts/SettingsContext";
import { channelKeys, useChannels } from "@renderer/hooks/api/useChannels";
import { useCreatePost } from "@renderer/hooks/api/usePost";
import {
  subredditLastPostDateKeys,
  useSubredditLastPostDates,
} from "@renderer/hooks/api/useSubredditLastPostDates";
import { useRedditUrlGenerator } from "@renderer/hooks/business/useRedditUrlGenerator";
import { useClipboard } from "@renderer/hooks/ui/useClipboard";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CHANNEL_TYPES } from "../../../../../features/channels/channelTypes";
import { Subreddit } from "../../../../../features/channels/subreddit";
import { Media } from "../../../../../features/library/entity";
import { PostState } from "./types";

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
  const createPostMutation = useCreatePost();
  const queryClient = useQueryClient();
  const { copyToClipboard } = useClipboard();
  const { settings } = useSettings();

  // Helper function to remove hashtags from end of caption (used only for user input)
  const removeHashtagsFromEnd = (caption: string): string => {
    if (!caption) return "";
    
    // Remove hashtags from the end of the caption
    return caption.replace(/#[^\s]*(\s+#[^\s]*)*\s*$/, "").trim();
  };

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

    const redditChannel = channels.find((c) => c.type.id === CHANNEL_TYPES.reddit.id);
    if (!redditChannel) {
      setPostState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          type: "general",
          message: "No Reddit channel found",
          retryable: false,
        },
      }));
      return;
    }

    setPostState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use the new backend API to generate a post
      const generatedPost = await window.api["reddit-poster:generateRandomPost"](
        subreddits,
        redditChannel.id
      );

      // Update state with generated data
      setPostState({
        subreddit: generatedPost.subreddit,
        media: generatedPost.media,
        caption: generatedPost.caption,
        redgifsUrl: generatedPost.redgifsUrl,
        isLoading: false,
        error: null,
        isUrlReady: true,
        totalMediaAvailable: 1, // Backend doesn't return this yet
        hasPostedToReddit: false,
      });
    } catch (error) {
      setPostState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          type: "general",
          message: error instanceof Error ? error.message : "Unknown error",
          retryable: true,
        },
      }));
    }
  }, [
    subreddits,
    channels,
  ]);

  const refreshPost = useCallback(async (): Promise<void> => {
    await generateRandomPost();
  }, [generateRandomPost]);

  const refreshMedia = useCallback(async (): Promise<void> => {
    if (!postState.subreddit) {
      return;
    }

    const redditChannel = channels.find((c) => c.type.id === CHANNEL_TYPES.reddit.id);
    if (!redditChannel) {
      setPostState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          type: "general",
          message: "No Reddit channel found",
          retryable: false,
        },
      }));
      return;
    }

    setPostState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {

      // Use the new backend API to regenerate media for the current subreddit
      const regeneratedMedia = await window.api["reddit-poster:regenerateMedia"](
        postState.subreddit.id,
        redditChannel.id
      );

      // Update state with new media data, keeping the same subreddit
      setPostState((prev) => ({
        ...prev,
        media: regeneratedMedia.media,
        caption: regeneratedMedia.caption,
        redgifsUrl: regeneratedMedia.redgifsUrl,
        isLoading: false,
        error: null,
        isUrlReady: true,
        totalMediaAvailable: 1, // Backend doesn't return this yet
        hasPostedToReddit: false,
      }));
    } catch (error) {
      console.error(error);
      setPostState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          type: "media",
          message: error instanceof Error ? error.message : "Unknown error",
          retryable: true,
        },
      }));
    }
  }, [postState.subreddit, channels]);

  const hasGeneratedInitialPost = useRef(false);
  useEffect(() => {
    if (subreddits.length === 0 || hasGeneratedInitialPost.current) {
      return;
    }

    hasGeneratedInitialPost.current = true;
    generateRandomPost();
  }, [subreddits.length, generateRandomPost]);

  const selectSpecificMedia = useCallback((media: Media) => {
    setPostState((prev) => ({ ...prev, media }));
  }, []);

  const openRedditPost = useCallback(() => {
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
        if (settings?.libraryPath) {
          const mediaPath =
            settings.libraryPath +
            (settings.libraryPath.endsWith("/") ? "" : "/") +
            postState.media.relativePath;
          window.api["os:revealInFinder"](mediaPath);
        }
      } catch (_error) {
        console.warn("Failed to reveal image in Finder:", _error);
      }
    }
  }, [generateUrl, postState.media, settings]);

  const openRedgifsUrl = useCallback(() => {
    if (!postState.redgifsUrl) {
      return;
    }

    window.open(postState.redgifsUrl, "_blank", "noopener,noreferrer");
  }, [postState.redgifsUrl]);

  const openMediaInFinder = useCallback(() => {
    if (!postState.media) {
      return;
    }

    if (settings?.libraryPath) {
      const mediaPath =
        settings.libraryPath +
        (settings.libraryPath.endsWith("/") ? "" : "/") +
        postState.media.relativePath;
      window.api["os:revealInFinder"](mediaPath);
    }
  }, [postState.media, settings]);

  const copyMediaNameToClipboard = useCallback(() => {
    if (!postState.media) {
      return;
    }

    copyToClipboard(postState.media.name);
  }, [postState.media, copyToClipboard]);

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

      // Invalidate subreddit queries first to ensure fresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: channelKeys.subreddits }),
        queryClient.invalidateQueries({
          queryKey: subredditLastPostDateKeys.lastPostDates(subredditIds),
        }),
      ]);

      // Generate a new random post after queries are invalidated
      await generateRandomPost();
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

  // RefreshRedgifsUrl is now handled by the backend API during media regeneration

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
