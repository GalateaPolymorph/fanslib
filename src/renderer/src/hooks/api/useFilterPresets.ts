import { useToast } from "@renderer/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateFilterPresetPayload,
  UpdateFilterPresetPayload,
} from "../../../../features/filter-presets/api-type";

// Query keys
export const filterPresetKeys = {
  all: ["filterPresets"] as const,
  byId: (id: string) => ["filterPresets", id] as const,
};

// Fetch all filter presets
export const useFilterPresets = () => {
  return useQuery({
    queryKey: filterPresetKeys.all,
    queryFn: async () => {
      const presets = await window.api["filterPresets:getAll"]();
      return presets;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Fetch single filter preset with validation
export const useFilterPreset = (id: string | undefined) => {
  return useQuery({
    queryKey: filterPresetKeys.byId(id!),
    queryFn: async () => {
      if (!id) throw new Error("Filter preset ID is required");
      const preset = await window.api["filterPresets:get"](id);
      if (!preset) throw new Error("Filter preset not found");
      return preset;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Create filter preset mutation
export const useCreateFilterPreset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: CreateFilterPresetPayload) => {
      const result = await window.api["filterPresets:create"](payload);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filterPresetKeys.all });
      toast({
        title: "Filter preset saved successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save filter preset",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Update filter preset mutation
export const useUpdateFilterPreset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      presetId,
      updates,
    }: {
      presetId: string;
      updates: UpdateFilterPresetPayload;
    }) => {
      const result = await window.api["filterPresets:update"](presetId, updates);
      return result;
    },
    onSuccess: (_, { presetId }) => {
      queryClient.invalidateQueries({ queryKey: filterPresetKeys.all });
      queryClient.invalidateQueries({ queryKey: filterPresetKeys.byId(presetId) });
      toast({
        title: "Filter preset updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update filter preset",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Delete filter preset mutation
export const useDeleteFilterPreset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (presetId: string) => {
      await window.api["filterPresets:delete"](presetId);
      return presetId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filterPresetKeys.all });
      toast({
        title: "Filter preset deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete filter preset",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
