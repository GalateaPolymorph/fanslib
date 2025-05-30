import { useCallback } from "react";
import { Media } from "../../../../features/library/entity";
import { usePostsByMediaId } from "../api/usePost";

type CaptionGeneratorResult = {
  generateCaption: (media: Media | null) => Promise<string>;
};

export const useCaptionGenerator = (): CaptionGeneratorResult => {
  const generateCaption = useCallback(async (media: Media | null): Promise<string> => {
    if (!media) {
      return "";
    }

    try {
      // We need to fetch posts for this media directly
      const posts = await window.api["post:byMediaId"](media.id);

      // Filter posts that have captions and sort by most recent
      const postsWithCaptions = posts
        .filter((post) => post.caption && post.caption.trim().length > 0)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Use the most recent post's caption, or empty string if none found
      const caption = postsWithCaptions.length > 0 ? postsWithCaptions[0].caption || "" : "";

      return caption;
    } catch (error) {
      console.warn("Failed to generate caption for media:", error);
      return "";
    }
  }, []);

  return {
    generateCaption,
  };
};

// Keep the original hook for backward compatibility during migration
type MediaCaptionResult = {
  caption: string;
  isLoading: boolean;
  error: Error | null;
  hasExistingPosts: boolean;
};

export const useMediaCaption = (media: Media | null): MediaCaptionResult => {
  const { data: posts = [], isLoading, error } = usePostsByMediaId(media?.id);

  const result = {
    caption: "",
    isLoading,
    error: error as Error | null,
    hasExistingPosts: false,
  };

  if (isLoading) {
    return {
      ...result,
      isLoading: true,
    };
  }

  if (error) {
    return {
      ...result,
      isLoading: false,
      error: error as Error,
    };
  }

  // Filter posts that have captions and sort by most recent
  const postsWithCaptions = posts
    .filter((post) => post.caption && post.caption.trim().length > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Use the most recent post's caption, or empty string if none found
  const caption = postsWithCaptions.length > 0 ? postsWithCaptions[0].caption || "" : "";

  return {
    caption,
    isLoading: false,
    error: null,
    hasExistingPosts: posts.length > 0,
  };
};
