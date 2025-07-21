import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Channel } from "../../../../features/channels/entity";
import { Subreddit } from "../../../../features/channels/subreddit";
import { VerificationStatus } from "../../../../features/channels/type";
import type { SubredditPostingTime } from "../../../../features/channels/api-type";

// Query keys
export const channelKeys = {
  all: ["channels"] as const,
  byId: (id: string) => ["channels", id] as const,
  subreddits: ["channels", "subreddits"] as const,
  subredditById: (id: string) => ["channels", "subreddits", id] as const,
};

// Re-export from dedicated hook
export { subredditLastPostDateKeys, useSubredditLastPostDates } from "./useSubredditLastPostDates";

// Fetch all channels
export const useChannels = () => {
  return useQuery({
    queryKey: channelKeys.all,
    queryFn: async () => {
      const channels = await window.api["channel:getAll"]();
      return channels;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Fetch all subreddits
export const useSubreddits = () => {
  return useQuery({
    queryKey: channelKeys.subreddits,
    queryFn: async () => {
      const subreddits = await window.api["channel:subreddit-list"]();
      return subreddits;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Fetch single subreddit
export const useSubreddit = (id: string | undefined) => {
  return useQuery({
    queryKey: channelKeys.subredditById(id!),
    queryFn: async () => {
      if (!id) throw new Error("Subreddit ID is required");
      const subreddit = await window.api["channel:subreddit-get"](id);
      if (!subreddit) throw new Error("Subreddit not found");
      return subreddit;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Create channel mutation
export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (channelData: Omit<Channel, "id">) => {
      const result = await window.api["channel:create"](channelData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.all });
      toast({
        title: "Channel created successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create channel",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Update channel mutation
export const useUpdateChannel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      channelId,
      updates,
    }: {
      channelId: string;
      updates: Partial<Channel>;
    }) => {
      const result = await window.api["channel:update"](channelId, updates);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.all });
      toast({
        title: "Channel updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update channel",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Delete channel mutation
export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (channelId: string) => {
      await window.api["channel:delete"](channelId);
      return channelId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.all });
      toast({
        title: "Channel deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete channel",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Create subreddit mutation
export const useCreateSubreddit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (subredditData: Omit<Subreddit, "id">) => {
      const result = await window.api["channel:subreddit-create"](subredditData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.subreddits });
      toast({
        title: "Subreddit created successfully",
        description: "Posting times are being analyzed automatically",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create subreddit",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Update subreddit mutation
export const useUpdateSubreddit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      subredditId,
      updates,
    }: {
      subredditId: string;
      updates: {
        name: string;
        maxPostFrequencyHours?: number;
        notes?: string;
        memberCount?: number;
        verificationStatus?: VerificationStatus;
        eligibleMediaFilter?: any;
        defaultFlair?: string;
        captionPrefix?: string;
        postingTimesData?: SubredditPostingTime[];
        postingTimesLastFetched?: Date;
        postingTimesTimezone?: string;
      };
    }) => {
      const result = await window.api["channel:subreddit-update"](subredditId, updates);
      return result;
    },
    onSuccess: (_, { subredditId }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.subreddits });
      queryClient.invalidateQueries({ queryKey: channelKeys.subredditById(subredditId) });
      toast({
        title: "Subreddit updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update subreddit",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Delete subreddit mutation
export const useDeleteSubreddit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (subredditId: string) => {
      await window.api["channel:subreddit-delete"](subredditId);
      return subredditId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.subreddits });
      toast({
        title: "Subreddit deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete subreddit",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Analyze subreddit posting times mutation
export const useAnalyzeSubredditPostingTimes = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      subredditId, 
      timezone 
    }: { 
      subredditId: string; 
      timezone?: string; 
    }) => {
      const result = await window.api["channel:subreddit-analyze-posting-times"](subredditId, timezone);
      return result;
    },
    onSuccess: (_, { subredditId }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.subreddits });
      queryClient.invalidateQueries({ queryKey: channelKeys.subredditById(subredditId) });
      toast({
        title: "Posting times analyzed successfully",
        description: "Optimal posting times have been updated for this subreddit",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to analyze posting times",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
