import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssignTagsDto } from "../../../../features/tags/api-type";
import { MediaTag } from "../../../../features/tags/entity";
import { useToast } from "../../components/ui/use-toast";

export const useMediaTags = (mediaId: string, dimensionId?: number) => {
  return useQuery<MediaTag[]>({
    queryKey: ["media-tags", mediaId, dimensionId],
    queryFn: async () => {
      return window.api["tags:getMediaTags"](mediaId, dimensionId);
    },
    enabled: !!mediaId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useAssignTagsToMedia = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (dto: AssignTagsDto) => {
      return window.api["tags:assignTagsToMedia"](dto);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["media-tags", variables.mediaId] });
      toast({
        title: "Tags assigned successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to assign tags",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveTagsFromMedia = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ mediaId, tagIds }: { mediaId: string; tagIds: number[] }) => {
      return window.api["tags:removeTagsFromMedia"](mediaId, tagIds);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["media-tags", variables.mediaId] });
      toast({
        title: "Tags removed successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove tags",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

export const useBulkAssignTags = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assignments: AssignTagsDto[]) => {
      return window.api["tags:bulkAssignTags"](assignments);
    },
    onSuccess: (_, variables) => {
      const mediaIds = [...new Set(variables.map((assignment) => assignment.mediaId))];
      mediaIds.forEach((mediaId) => {
        queryClient.invalidateQueries({ queryKey: ["media-tags", mediaId] });
      });
      toast({
        title: `Tags assigned to ${mediaIds.length} media items`,
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to bulk assign tags",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
