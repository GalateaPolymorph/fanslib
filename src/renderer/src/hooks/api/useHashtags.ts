import { useToast } from "@renderer/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const hashtagKeys = {
  all: ["hashtags"] as const,
  byId: (id: number) => ["hashtags", id] as const,
};

// Fetch all hashtags
export const useHashtags = () => {
  return useQuery({
    queryKey: hashtagKeys.all,
    queryFn: async () => {
      const hashtags = await window.api["hashtag:list"]();
      return hashtags;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Create hashtag mutation
export const useCreateHashtag = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hashtagName: string) => {
      const result = await window.api["hashtag:create"](hashtagName);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hashtagKeys.all });
      toast({
        title: "Hashtag created successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create hashtag",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Delete hashtag mutation
export const useDeleteHashtag = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hashtagId: number) => {
      await window.api["hashtag:delete"](hashtagId);
      return hashtagId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hashtagKeys.all });
      toast({
        title: "Hashtag deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete hashtag",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Update hashtag stats mutation
export const useUpdateHashtagStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hashtagId,
      channelId,
      viewCount,
    }: {
      hashtagId: number;
      channelId: string;
      viewCount: number;
    }) => {
      await window.api["hashtag:stats:set"](hashtagId, channelId, viewCount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hashtagKeys.all });
    },
    onError: (error) => {
      console.error("Failed to update hashtag stats", error);
    },
  });
};
