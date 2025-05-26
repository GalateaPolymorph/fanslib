import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTagDimensionDto, UpdateTagDimensionDto } from "../../../../features/tags/api-type";
import { TagDimension } from "../../../../features/tags/entity";
import { useToast } from "../../components/ui/use-toast";

export const useTagDimensions = () => {
  return useQuery<TagDimension[]>({
    queryKey: ["tag-dimensions"],
    queryFn: async () => {
      return window.api["tags:getAllDimensions"]();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCreateTagDimension = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (dto: CreateTagDimensionDto) => {
      return window.api["tags:createDimension"](dto);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["tag-dimensions"] });
      toast({
        title: "Dimension created successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create dimension",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTagDimension = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: UpdateTagDimensionDto }) => {
      return window.api["tags:updateDimension"](id, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag-dimensions"] });
      toast({
        title: "Dimension updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update dimension",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTagDimension = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      return window.api["tags:deleteDimension"](id);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["tag-dimensions"] });
      toast({
        title: "Dimension deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete dimension",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

export const useTagDimensionById = (id: number) => {
  return useQuery<TagDimension>({
    queryKey: ["tag-dimension", id],
    queryFn: async () => {
      return window.api["tags:getDimensionById"](id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
