import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Media } from "../../../features/library/entity";
import {
  getMediaTagIdsByDimension,
  getTagSelectionStates,
  updateSelectionForMedia,
} from "../lib/selection-utils";
import { TagSelectionState, TagSelector } from "./TagSelector";

type UniversalBulkTagAssignmentProps = {
  dimensionName: string;
  selectedMedia: Media[];
  onUpdate: () => void;
  className?: string;
  tierDisplayFormat?: "dollar" | "level" | "both";
};

export const TagAssignment = ({
  dimensionName,
  selectedMedia,
  onUpdate,
  className,
  tierDisplayFormat = "both",
}: UniversalBulkTagAssignmentProps) => {
  const queryClient = useQueryClient();

  // Mutation for assigning tags to media
  const assignTagsMutation = useMutation({
    mutationFn: async (dto: {
      mediaId: string;
      tagDefinitionIds: number[];
      source: "manual" | "automated" | "imported";
    }) => {
      return window.api["tags:assignTagsToMedia"](dto);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: ["mediaTags"] });
      onUpdate();
    },
  });

  // Get current tag states for the dimension
  const getTagStates = (): TagSelectionState[] => {
    const states = getTagSelectionStates(selectedMedia, dimensionName);
    return states.map((state) => ({
      id: state.id,
      state: state.state,
    }));
  };

  // Handle tag assignment changes
  const handleTagChange = async (
    _tagStates: TagSelectionState[] | undefined,
    changedTagId: string | number
  ) => {
    if (selectedMedia.length === 0 || typeof changedTagId !== "number") return;

    try {
      await updateSelectionForMedia(
        selectedMedia,
        changedTagId,
        async (mediaId, tagIds) => {
          return assignTagsMutation.mutateAsync({
            mediaId,
            tagDefinitionIds: tagIds as number[],
            source: "manual",
          });
        },
        (media) => getMediaTagIdsByDimension(media, dimensionName)
      );
    } catch (error) {
      console.error("Failed to assign tags:", error);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          Assign {dimensionName.toLowerCase()}
        </div>
        <TagSelector
          dimensionName={dimensionName}
          value={getTagStates()}
          onChange={handleTagChange}
          multiple={true}
          tierDisplayFormat={tierDisplayFormat}
          disabledTags={assignTagsMutation.isPending ? [] : []} // Could add logic for disabled tags
        />
      </div>
    </div>
  );
};
