import { useAssignTagsToMedia, useMediaTags, useTagDimensions } from "../../hooks/tags";
import { DimensionTagSelector } from "./DimensionTagSelector";

type TagAssignmentPanelProps = {
  mediaId: string;
  className?: string;
};

export const TagAssignmentPanel = ({ mediaId, className }: TagAssignmentPanelProps) => {
  const { data: dimensions, isLoading: dimensionsLoading } = useTagDimensions();
  const { data: mediaTags, isLoading: mediaTagsLoading } = useMediaTags(mediaId);
  const assignTagsMutation = useAssignTagsToMedia();

  const assignTags = (dimensionId: number, tagIds: number[]) => {
    if (tagIds.length === 0) {
      // If no tags selected, remove all tags for this dimension
      const tagsToRemove =
        mediaTags
          ?.filter((mt) => mt.tag?.dimensionId === dimensionId)
          .map((mt) => mt.tagDefinitionId) || [];

      if (tagsToRemove.length > 0) {
        window.api["tags:removeTagsFromMedia"](mediaId, tagsToRemove);
      }
      return;
    }

    assignTagsMutation.mutate({
      mediaId,
      tagDefinitionIds: tagIds,
      source: "manual",
    });
  };

  if (dimensionsLoading || mediaTagsLoading) {
    return (
      <div className={className}>
        <h3 className="text-lg font-medium mb-4">Content Tags</h3>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4">Content Tags</h3>

      {dimensions?.map((dimension) => (
        <DimensionTagSelector
          key={dimension.id}
          dimension={dimension}
          selectedTags={mediaTags?.filter((mt) => mt.tag?.dimensionId === dimension.id) || []}
          onTagsChange={(tagIds) => assignTags(dimension.id, tagIds)}
        />
      ))}

      {assignTagsMutation.isPending && (
        <div className="text-sm text-gray-500 mt-2">Saving tags...</div>
      )}
    </div>
  );
};
