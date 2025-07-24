import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Media } from "../../../../features/library/entity";
import { usePostsByMediaId } from "../api/usePost";

type CaptionGeneratorResult = {
  generateCaption: (media: Media | null) => Promise<string>;
};

export const useCaptionGenerator = (): CaptionGeneratorResult => {
  const queryClient = useQueryClient();

  const generateCaption = useCallback(
    async (media: Media | null): Promise<string> => {
      if (!media) {
        return "";
      }

      try {
        // Try to get posts from the cache first, or fetch if needed
        const posts = await queryClient.fetchQuery({
          queryKey: ["posts", "byMediaId", media.id],
          queryFn: async () => {
            return window.api["post:byMediaId"](media.id);
          },
          staleTime: 2 * 60 * 1000, // 2 minutes
        });

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
    },
    [queryClient]
  );

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
