import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAllMediaParams } from "../../../../features/library/api-type";
import { Media } from "../../../../features/library/entity";

// Query keys
export const mediaKeys = {
  all: ["media"] as const,
  byId: (id: string) => ["media", id] as const,
  byMediaId: (mediaId: string) => ["posts", "byMediaId", mediaId] as const,
  adjacent: (id: string, params?: GetAllMediaParams) => ["media", id, "adjacent", params] as const,
};

// Fetch single media
export const useMedia = (id: string | undefined) => {
  return useQuery({
    queryKey: mediaKeys.byId(id!),
    queryFn: async () => {
      if (!id) throw new Error("Media ID is required");
      const media = await window.api["library:get"](id);
      if (!media) throw new Error("Media not found");
      return media;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch adjacent media
export const useAdjacentMedia = (mediaId: string | undefined, params?: GetAllMediaParams) => {
  return useQuery({
    queryKey: mediaKeys.adjacent(mediaId!, params),
    queryFn: async () => {
      if (!mediaId) throw new Error("Media ID is required");
      return await window.api["library:adjacentMedia"](mediaId, params);
    },
    enabled: !!mediaId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update media mutation
export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ mediaId, updates }: { mediaId: string; updates: Partial<Media> }) => {
      const result = await window.api["library:update"](mediaId, updates);
      if (!result) throw new Error("Failed to update media");
      return result;
    },
    onMutate: async ({ mediaId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: mediaKeys.byId(mediaId) });

      // Snapshot the previous value
      const previousMedia = queryClient.getQueryData<Media>(mediaKeys.byId(mediaId));

      // Optimistically update to the new value
      if (previousMedia) {
        queryClient.setQueryData<Media>(mediaKeys.byId(mediaId), {
          ...previousMedia,
          ...updates,
        });
      }

      // Return a context object with the snapshotted value
      return { previousMedia };
    },
    onError: (error, { mediaId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMedia) {
        queryClient.setQueryData(mediaKeys.byId(mediaId), context.previousMedia);
      }

      toast({
        title: "Failed to update media",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
    onSuccess: (updatedMedia, { mediaId }) => {
      // Update the cache with the actual server response
      queryClient.setQueryData(mediaKeys.byId(mediaId), updatedMedia);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });

      toast({
        title: "Media updated",
        duration: 2000,
      });
    },
    onSettled: (_, __, { mediaId }) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: mediaKeys.byId(mediaId) });
    },
  });
};

// Delete media mutation
export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (mediaId: string) => {
      await window.api["library:delete"](mediaId);
      return mediaId;
    },
    onSuccess: (mediaId) => {
      // Remove the media from cache
      queryClient.removeQueries({ queryKey: mediaKeys.byId(mediaId) });

      // Invalidate any list queries that might include this media
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });

      toast({
        title: "Media deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete media",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
