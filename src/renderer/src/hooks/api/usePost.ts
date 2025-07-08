import { useToast } from "@renderer/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Post } from "../../../../features/posts/entity";

// Query keys
export const postKeys = {
  all: ["posts"] as const,
  byId: (id: string) => ["posts", id] as const,
  adjacent: (id: string) => ["posts", id, "adjacent"] as const,
};

// Fetch single post
export const usePost = (postId: string | undefined) => {
  return useQuery({
    queryKey: postKeys.byId(postId!),
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      const post = await window.api["post:byId"](postId);
      if (!post) throw new Error("Post not found");
      return post;
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch adjacent posts
export const useAdjacentPosts = (postId: string | undefined) => {
  return useQuery({
    queryKey: postKeys.adjacent(postId!),
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      return await window.api["post:adjacentPosts"](postId);
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch posts by media ID
export const usePostsByMediaId = (mediaId: string | undefined) => {
  return useQuery({
    queryKey: ["posts", "byMediaId", mediaId],
    queryFn: async () => {
      if (!mediaId) throw new Error("Media ID is required");
      const posts = await window.api["post:byMediaId"](mediaId);
      return posts;
    },
    enabled: !!mediaId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Update post mutation
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      postId,
      updates,
      newMediaPathsInOrder,
    }: {
      postId: string;
      updates: Partial<Post>;
      newMediaPathsInOrder?: string[];
    }) => {
      const result = await window.api["post:update"](postId, updates, newMediaPathsInOrder);
      if (!result) throw new Error("Failed to update post");
      return result;
    },
    onMutate: async ({ postId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.byId(postId) });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData<Post>(postKeys.byId(postId));

      // Optimistically update to the new value
      if (previousPost) {
        queryClient.setQueryData<Post>(postKeys.byId(postId), {
          ...previousPost,
          ...updates,
        });
      }

      // Return a context object with the snapshotted value
      return { previousPost };
    },
    onError: (error, { postId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.byId(postId), context.previousPost);
      }

      toast({
        title: "Failed to update post",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
    onSuccess: (updatedPost, { postId, newMediaPathsInOrder }, context) => {
      // Update the cache with the actual server response
      queryClient.setQueryData(postKeys.byId(postId), updatedPost);

      // Invalidate adjacent posts in case the update affects navigation
      queryClient.invalidateQueries({ queryKey: postKeys.adjacent(postId) });

      // If media was updated, invalidate media-related queries for both old and new media
      if (newMediaPathsInOrder !== undefined) {
        const previousMediaIds = context?.previousPost?.postMedia.map((pm) => pm.media.id) || [];
        const newMediaIds = updatedPost.postMedia.map((pm) => pm.media.id);

        // Combine old and new media IDs to ensure all affected media queries are invalidated
        const allAffectedMediaIds = [...new Set([...previousMediaIds, ...newMediaIds])];

        allAffectedMediaIds.forEach((mediaId) => {
          queryClient.invalidateQueries({
            queryKey: ["posts", "byMediaId", mediaId],
          });
        });
      }

      toast({
        title: "Post updated",
        duration: 2000,
      });
    },
    onSettled: (_, __, { postId }) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: postKeys.byId(postId) });
    },
  });
};

// Delete post mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      // Get the post data before deletion to extract media IDs
      const post = queryClient.getQueryData<Post>(postKeys.byId(postId));
      await window.api["post:delete"](postId);
      return { postId, mediaIds: post?.postMedia.map((pm) => pm.media.id) || [] };
    },
    onSuccess: ({ postId, mediaIds }) => {
      // Remove the post from cache
      queryClient.removeQueries({ queryKey: postKeys.byId(postId) });
      queryClient.removeQueries({ queryKey: postKeys.adjacent(postId) });

      // Invalidate any list queries that might include this post
      queryClient.invalidateQueries({ queryKey: postKeys.all });

      // Invalidate media-related queries for each media item that was in the deleted post
      // This ensures Media Detail pages show the updated posts list
      mediaIds.forEach((mediaId) => {
        queryClient.invalidateQueries({
          queryKey: ["posts", "byMediaId", mediaId],
        });
      });

      toast({
        title: "Post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete post",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      postData,
      mediaIds,
    }: {
      postData: {
        date: string;
        channelId: string;
        caption?: string;
        status: "draft" | "scheduled" | "posted";
        url?: string;
        fanslyStatisticsId?: string;
        subredditId?: string;
      };
      mediaIds: string[];
    }) => {
      const result = await window.api["post:create"](postData, mediaIds);
      if (!result) throw new Error("Failed to create post");
      return result;
    },
    onSuccess: (newPost, { mediaIds }) => {
      // Add the new post to cache
      queryClient.setQueryData(postKeys.byId(newPost.id), newPost);

      // Invalidate list queries to include the new post
      queryClient.invalidateQueries({ queryKey: postKeys.all });

      // Invalidate media-related queries for each media item in the new post
      // This ensures Media Detail pages show the updated posts list
      mediaIds.forEach((mediaId) => {
        queryClient.invalidateQueries({
          queryKey: ["posts", "byMediaId", mediaId],
        });
      });

      toast({
        title: "Post created successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Custom hook for debounced post field updates
export const useDebouncedPostUpdate = (post: Post | undefined) => {
  const updatePostMutation = useUpdatePost();

  const updateField = async (updates: Partial<Post>) => {
    if (!post) return;

    try {
      await updatePostMutation.mutateAsync({
        postId: post.id,
        updates,
      });
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return { updateField, isLoading: updatePostMutation.isPending };
};

// Add media to post mutation
export const useAddMediaToPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, mediaIds }: { postId: string; mediaIds: string[] }) => {
      const result = await window.api["post:addMedia"](postId, mediaIds);
      if (!result) throw new Error("Failed to add media to post");
      return result;
    },
    onSuccess: (updatedPost, { postId, mediaIds }) => {
      // Update the post cache with the new data
      queryClient.setQueryData(postKeys.byId(postId), updatedPost);

      // Invalidate all post-related queries
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.byId(postId) });

      // Invalidate media-related queries for each added media item
      // This ensures Media Detail pages show the updated posts list
      mediaIds.forEach((mediaId) => {
        queryClient.invalidateQueries({
          queryKey: ["posts", "byMediaId", mediaId],
        });
      });

      toast({
        title:
          mediaIds.length === 1
            ? "Media added to post"
            : `${mediaIds.length} media items added to post`,
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add media to post",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Remove media from post mutation
export const useRemoveMediaFromPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      postId,
      postMediaIdsToRemove,
    }: {
      postId: string;
      postMediaIdsToRemove: string[];
      mediaIdsToInvalidate: string[];
    }) => {
      const result = await window.api["post:removeMedia"](postId, postMediaIdsToRemove);
      if (!result) throw new Error("Failed to remove media from post");
      return result;
    },
    onSuccess: (updatedPost, { postId, mediaIdsToInvalidate }) => {
      // Update the post cache with the new data
      queryClient.setQueryData(postKeys.byId(postId), updatedPost);

      // Invalidate all post-related queries
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.byId(postId) });

      // Invalidate media-related queries for each removed media item
      // This ensures Media Detail pages show the updated posts list
      mediaIdsToInvalidate.forEach((mediaId) => {
        queryClient.invalidateQueries({
          queryKey: ["posts", "byMediaId", mediaId],
        });
      });

      toast({
        title:
          mediaIdsToInvalidate.length === 1
            ? "Media removed from post"
            : `${mediaIdsToInvalidate.length} media items removed from post`,
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove media from post",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
