import {
  useAssignTagsToMedia,
  useMediaTags,
  useRemoveTagsFromMedia,
} from "@renderer/hooks/tags/useMediaTags";
import { useTagsByDimension } from "@renderer/hooks/tags/useTagDefinitions";
import { useTagDimensions } from "@renderer/hooks/tags/useTagDimensions";
import { useMemo } from "react";
import { Media } from "../../../../features/library/entity";
import { TagSelectionState, TagSelector } from "../../components/TagSelector";
import { getMediaTagsForDimension, mediaTagsToSelectionState } from "../../lib/media-tags";

// Dimension constants
const CATEGORY_DIMENSION_NAME = "Category";

type Props = {
  media: Media;
};

export const MediaDetailCategorySelect = ({ media }: Props) => {
  const { data: mediaTags = [] } = useMediaTags(media.id);
  const { data: dimensions = [] } = useTagDimensions();
  const assignTagsMutation = useAssignTagsToMedia();
  const removeTagsMutation = useRemoveTagsFromMedia();

  // Find Category dimension (with backward compatibility for Content Category)
  const categoryDimension = useMemo(
    () =>
      dimensions.find((d) => d.name === CATEGORY_DIMENSION_NAME || d.name === "Content Category"),
    [dimensions]
  );

  const { data: availableTags = [] } = useTagsByDimension(categoryDimension?.id || 0);

  // Get current Category tags (with backward compatibility for Content Category)
  const categoryTags = useMemo(() => {
    const categoryTagsNew = getMediaTagsForDimension(mediaTags, CATEGORY_DIMENSION_NAME);
    const categoryTagsOld = getMediaTagsForDimension(mediaTags, "Content Category");
    return categoryTagsNew.length > 0 ? categoryTagsNew : categoryTagsOld;
  }, [mediaTags]);

  const currentSelection = mediaTagsToSelectionState(categoryTags);

  const updateCategories = async (
    tagStates: TagSelectionState[] | undefined,
    _changedTagId: string | number
  ) => {
    if (assignTagsMutation.isPending || removeTagsMutation.isPending) return;

    try {
      // Remove existing Category tags first
      const existingTagIds = categoryTags
        .map((tag) => tag.tagDefinitionId)
        .filter((id): id is number => id !== null);

      if (existingTagIds.length > 0) {
        await removeTagsMutation.mutateAsync({
          mediaId: media.id,
          tagIds: existingTagIds,
        });
      }

      // Assign new tags if any are selected
      const selectedTags = tagStates?.filter((t) => t.state === "selected") || [];

      if (selectedTags.length > 0) {
        const tagDefinitionIds: number[] = [];

        for (const selectedTag of selectedTags) {
          let tagDefinitionId: number | undefined;

          if (typeof selectedTag.id === "string") {
            // For string IDs, find the corresponding tag definition
            const matchingTag = availableTags.find(
              (tag) => tag.value === selectedTag.id || tag.id.toString() === selectedTag.id
            );
            tagDefinitionId = matchingTag?.id;
          } else {
            // For numeric IDs, use directly (should be tag definition ID)
            tagDefinitionId = selectedTag.id;
          }

          if (tagDefinitionId) {
            tagDefinitionIds.push(tagDefinitionId);
          } else {
            console.warn(`No tag definition found for Category ${selectedTag.id}`);
          }
        }

        if (tagDefinitionIds.length > 0) {
          await assignTagsMutation.mutateAsync({
            mediaId: media.id,
            tagDefinitionIds,
            source: "manual",
          });
        }
      }
    } catch (error) {
      console.error("Failed to update categories:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Categories</h3>
      <TagSelector
        dimensionName={categoryDimension?.name || CATEGORY_DIMENSION_NAME}
        value={currentSelection.length > 0 ? currentSelection : undefined}
        onChange={updateCategories}
        multiple={true}
        includeNoneOption={true}
      />
    </div>
  );
};
