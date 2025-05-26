import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTagDefinitionDto, UpdateTagDefinitionDto } from "../../../../features/tags/api-type";
import { TagDefinition } from "../../../../features/tags/entity";
import { useToast } from "../../components/ui/use-toast";

export const useTagsByDimension = (dimensionId: number) => {
  return useQuery<TagDefinition[]>({
    queryKey: ["dimension-tags", dimensionId],
    queryFn: async () => {
      return window.api["tags:getTagsByDimension"](dimensionId);
    },
    enabled: !!dimensionId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useTagDefinitionById = (id: number) => {
  return useQuery<TagDefinition>({
    queryKey: ["tag-definition", id],
    queryFn: async () => {
      return window.api["tags:getTagById"](id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTagDefinition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (dto: CreateTagDefinitionDto) => {
      return window.api["tags:createTag"](dto);
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["tag-dimensions"] }),
        queryClient.refetchQueries({ queryKey: ["dimension-tags", variables.dimensionId] }),
      ]);
      toast({
        title: "Tag created successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create tag",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTagDefinition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: UpdateTagDefinitionDto }) => {
      return window.api["tags:updateTag"](id, dto);
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["tag-dimensions"] }),
        queryClient.refetchQueries({ queryKey: ["dimension-tags", result.dimensionId] }),
        queryClient.refetchQueries({ queryKey: ["tag-definition", result.id] }),
      ]);
      toast({
        title: "Tag updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update tag",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTagDefinition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      return window.api["tags:deleteTag"](id);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["tag-dimensions"] }),
        queryClient.refetchQueries({ queryKey: ["dimension-tags"] }),
      ]);
      toast({
        title: "Tag deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete tag",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
