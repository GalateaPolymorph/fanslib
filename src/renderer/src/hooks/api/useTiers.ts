import { useToast } from "@renderer/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tier } from "src/features/tiers/entity";

// Query keys
export const tierKeys = {
  all: ["tiers"] as const,
  byId: (id: number) => ["tiers", id] as const,
};

// Fetch all tiers
export const useTiers = () => {
  return useQuery({
    queryKey: tierKeys.all,
    queryFn: async () => {
      const tiers = await window.api["tier:getAll"]();
      return tiers;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - tiers don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Create tier mutation
export const useCreateTier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tierData: Omit<Tier, "id">) => {
      const result = await window.api["tier:create"](tierData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tierKeys.all });
      toast({
        title: "Tier created successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create tier",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Update tier mutation
export const useUpdateTier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tierId, updates }: { tierId: number; updates: Partial<Tier> }) => {
      const result = await window.api["tier:update"](tierId, updates);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tierKeys.all });
      toast({
        title: "Tier updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update tier",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Delete tier mutation
export const useDeleteTier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tierId: number) => {
      await window.api["tier:delete"](tierId);
      return tierId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tierKeys.all });
      toast({
        title: "Tier deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete tier",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Assign tier to media mutation
export const useAssignTierToMedia = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ mediaId, tierId }: { mediaId: string; tierId: number }) => {
      const result = await window.api["library:assignTierToMedia"](mediaId, tierId);
      return result;
    },
    onSuccess: () => {
      // Invalidate media queries and tier queries
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: tierKeys.all });

      toast({
        title: "Tier assigned successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to assign tier",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Assign tier to multiple media mutation
export const useAssignTierToMedias = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ mediaIds, tierId }: { mediaIds: string[]; tierId: number }) => {
      const result = await window.api["library:assignTierToMedias"](mediaIds, tierId);
      return result;
    },
    onSuccess: (_, { mediaIds }) => {
      // Invalidate media queries and tier queries
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: tierKeys.all });

      toast({
        title: `Tier assigned to ${mediaIds.length} media items`,
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to assign tier",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Legacy hook wrapper for backward compatibility
export const useTiersLegacy = () => {
  const { data: tiers = [], isLoading, error, refetch } = useTiers();
  const assignTierToMediaMutation = useAssignTierToMedia();
  const assignTierToMediasMutation = useAssignTierToMedias();

  return {
    tiers,
    isLoading,
    error,
    loadTiers: refetch,
    assignTierToMedia: async (mediaId: string, tierId: number) => {
      try {
        await assignTierToMediaMutation.mutateAsync({ mediaId, tierId });
        return true;
      } catch (error) {
        console.error("Error assigning tier to media:", error);
        return false;
      }
    },
    assignTierToMedias: async (mediaIds: string[], tierId: number) => {
      try {
        await assignTierToMediasMutation.mutateAsync({ mediaIds, tierId });
        return true;
      } catch (error) {
        console.error("Failed to assign tier to medias:", error);
        return false;
      }
    },
  };
};
