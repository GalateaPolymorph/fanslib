import { useToast } from "@renderer/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";
import { AssignTagsDto } from "src/features/tags/api-type";
import { libraryQueryKeys } from "../useLibrary";
import { mediaKeys } from "../useMedia";
import { tagQueryKeys } from "./useTags";

export const useAssignTagsToMedia = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assignments: AssignTagsDto[]) => {
      return window.api["tags:bulkAssignTags"](assignments);
    },
    onSuccess: (_, variables) => {
      const mediaIds = [...new Set(variables.map((assignment) => assignment.mediaId))];

      // Invalidate tag-specific queries
      mediaIds.forEach((mediaId) => {
        queryClient.invalidateQueries({ queryKey: tagQueryKeys.tagsForMedia(mediaId) });
      });

      // Invalidate library queries to refresh Gallery and other media displays
      queryClient.invalidateQueries({ queryKey: libraryQueryKeys.all });

      // Also invalidate individual media queries for media detail pages
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });

      // Invalidate bulk media tags query used by useTagStates
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.tagsForMedias(mediaIds) });

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
