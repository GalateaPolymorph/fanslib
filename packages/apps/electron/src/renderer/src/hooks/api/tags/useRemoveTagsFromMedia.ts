import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../components/ui/Toast/use-toast";
import { libraryQueryKeys } from "../useLibrary";
import { mediaKeys } from "../useMedia";
import { tagQueryKeys } from "./useTags";

type BulkRemoveTagsDto = {
  mediaId: string;
  tagIds: number[];
}[];

export const useRemoveTagsFromMedia = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (removals: BulkRemoveTagsDto) => {
      const results = await Promise.all(
        removals.map(({ mediaId, tagIds }) =>
          window.api["tags:removeTagsFromMedia"](mediaId, tagIds)
        )
      );
      return results;
    },
    onSuccess: (_, variables) => {
      const mediaIds = [...new Set(variables.map((removal) => removal.mediaId))];

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
        title: `Tags removed from ${mediaIds.length} media items`,
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
