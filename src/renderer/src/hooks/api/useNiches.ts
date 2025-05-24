import { useToast } from "@renderer/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const nicheKeys = {
  all: ["niches"] as const,
  byId: (id: number) => ["niches", id] as const,
};

// Fetch all niches
export const useNiches = () => {
  return useQuery({
    queryKey: nicheKeys.all,
    queryFn: async () => {
      const niches = await window.api["niche:getAll"]();
      return niches;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - niches don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Create niche mutation
export const useCreateNiche = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (nicheData: { name: string; hashtags?: string[] }) => {
      const result = await window.api["niche:create"](nicheData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nicheKeys.all });
      toast({
        title: "Niche created successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create niche",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Update niche mutation
export const useUpdateNiche = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      nicheId,
      updates,
    }: {
      nicheId: number;
      updates: { name?: string; hashtags?: string[] };
    }) => {
      const result = await window.api["niche:update"](nicheId, updates);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nicheKeys.all });
      toast({
        title: "Niche updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update niche",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Delete niche mutation
export const useDeleteNiche = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (nicheId: number) => {
      await window.api["niche:delete"](nicheId);
      return nicheId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nicheKeys.all });
      toast({
        title: "Niche deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete niche",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
