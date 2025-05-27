import {
  useAssignTagsToMedia,
  useMediaTags,
  useRemoveTagsFromMedia,
} from "@renderer/hooks/tags/useMediaTags";
import { useTagsByDimension } from "@renderer/hooks/tags/useTagDefinitions";
import { useTagDimensions } from "@renderer/hooks/tags/useTagDimensions";
import { useMemo } from "react";
import { Media } from "src/features/library/entity";
import { TagSelectionState, TagSelector } from "../../components/TagSelector";
import { getMediaTagsForDimension, mediaTagsToSelectionState } from "../../lib/media-tags";

// Dimension constants
const TIER_DIMENSION_NAME = "Tier";

type Props = {
  media: Media;
};

export const MediaDetailTierSelect = ({ media }: Props) => {
  const { data: mediaTags = [] } = useMediaTags(media.id);
  const { data: dimensions = [] } = useTagDimensions();
  const assignTagsMutation = useAssignTagsToMedia();
  const removeTagsMutation = useRemoveTagsFromMedia();

  // Find Tier dimension (with backward compatibility for Content Quality)
  const tierDimension = useMemo(
    () => dimensions.find((d) => d.name === TIER_DIMENSION_NAME || d.name === "Content Quality"),
    [dimensions]
  );

  const { data: availableTags = [] } = useTagsByDimension(tierDimension?.id || 0);

  // Get current Tier tags (with backward compatibility for Content Quality)
  const tierTags = useMemo(() => {
    const tierTagsNew = getMediaTagsForDimension(mediaTags, TIER_DIMENSION_NAME);
    const tierTagsOld = getMediaTagsForDimension(mediaTags, "Content Quality");
    return tierTagsNew.length > 0 ? tierTagsNew : tierTagsOld;
  }, [mediaTags]);

  const currentSelection = mediaTagsToSelectionState(tierTags);

  const updateTier = async (
    tagStates: TagSelectionState[] | undefined,
    _changedTagId: string | number
  ) => {
    if (assignTagsMutation.isPending || removeTagsMutation.isPending) return;

    try {
      // Remove existing Tier tags first
      const existingTagIds = tierTags
        .map((tag) => tag.tagDefinitionId)
        .filter((id): id is number => id !== null);

      if (existingTagIds.length > 0) {
        await removeTagsMutation.mutateAsync({
          mediaId: media.id,
          tagIds: existingTagIds,
        });
      }

      // Assign new tag if one is selected
      const selectedTag = tagStates?.find((t) => t.state === "selected");

      if (selectedTag) {
        let tagDefinitionId: number | undefined;

        if (typeof selectedTag.id === "number") {
          // For numerical values (legacy), find the corresponding tag definition
          const matchingTag = availableTags.find((tag) => parseFloat(tag.value) === selectedTag.id);
          tagDefinitionId = matchingTag?.id;
        } else {
          // For string IDs (categorical values or tag definition IDs)
          const matchingTag = availableTags.find(
            (tag) => tag.value === selectedTag.id || tag.id.toString() === selectedTag.id
          );
          tagDefinitionId = matchingTag?.id || parseInt(selectedTag.id.toString());
        }

        if (tagDefinitionId) {
          await assignTagsMutation.mutateAsync({
            mediaId: media.id,
            tagDefinitionIds: [tagDefinitionId],
            source: "manual",
          });
        } else {
          console.warn(`No tag definition found for Tier value ${selectedTag.id}`);
        }
      }
    } catch (error) {
      console.error("Failed to update tier:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Tier</h3>
      <TagSelector
        dimensionName={tierDimension?.name || TIER_DIMENSION_NAME}
        value={currentSelection.length > 0 ? currentSelection : undefined}
        onChange={updateTier}
        multiple={false}
        tierDisplayFormat="categorical"
      />
    </div>
  );
};
