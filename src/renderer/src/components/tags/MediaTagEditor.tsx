import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAssignTagsToMedia, useMediaTags, useTagDimensions } from "../../hooks/tags";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { DimensionTagSelector } from "./DimensionTagSelector";

type MediaTagEditorProps = {
  mediaId: string;
  className?: string;
};

export const MediaTagEditor = ({ mediaId, className }: MediaTagEditorProps) => {
  const [activeDimensions, setActiveDimensions] = useState<Set<number>>(new Set());

  const { data: dimensions, isLoading: dimensionsLoading } = useTagDimensions();
  const { data: mediaTags, isLoading: mediaTagsLoading } = useMediaTags(mediaId);
  const assignTagsMutation = useAssignTagsToMedia();

  // Auto-activate dimensions that have existing tags
  useEffect(() => {
    if (mediaTags && mediaTags.length > 0) {
      const dimensionsWithTags = new Set(
        mediaTags.map((mt) => mt.tag?.dimensionId).filter((id): id is number => id !== undefined)
      );

      if (dimensionsWithTags.size > 0) {
        setActiveDimensions((prev) => {
          // Merge existing active dimensions with dimensions that have tags
          const merged = new Set([...prev, ...dimensionsWithTags]);
          return merged;
        });
      }
    }
  }, [mediaTags]);

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

  const addDimension = (dimensionId: number) => {
    setActiveDimensions((prev) => new Set([...prev, dimensionId]));
  };

  const removeDimension = (dimensionId: number) => {
    setActiveDimensions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(dimensionId);
      return newSet;
    });

    // Clear any existing tags for this dimension
    assignTags(dimensionId, []);
  };

  const getAvailableDimensions = () => {
    if (!dimensions) return [];
    return dimensions.filter((dim) => !activeDimensions.has(dim.id));
  };

  const getActiveDimensionData = () => {
    if (!dimensions) return [];
    return dimensions.filter((dim) => activeDimensions.has(dim.id));
  };

  const getDimensionColor = (dataType: string) => {
    switch (dataType) {
      case "categorical":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 hover:border-blue-300";
      case "numerical":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200 hover:border-green-300";
      case "boolean":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200 hover:border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200 hover:border-gray-300";
    }
  };

  const getDimensionNameColor = (dataType: string) => {
    switch (dataType) {
      case "categorical":
        return "text-blue-700";
      case "numerical":
        return "text-green-700";
      case "boolean":
        return "text-purple-700";
      default:
        return "text-gray-700";
    }
  };

  if (dimensionsLoading || mediaTagsLoading) {
    return (
      <div className={className}>
        <h3 className="text-lg font-medium mb-4">Tags</h3>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded-full w-16"></div>
              ))}
            </div>
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
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
      <h3 className="text-lg font-medium mb-4">Tags</h3>

      {/* Available Dimensions Pills - Simplified */}
      {getAvailableDimensions().length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {getAvailableDimensions().map((dimension) => (
              <button
                key={dimension.id}
                onClick={() => addDimension(dimension.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors border cursor-pointer ${getDimensionColor(
                  dimension.dataType
                )}`}
                aria-label={`Add ${dimension.name} tag dimension`}
              >
                <Plus className="w-3.5 h-3.5" />
                {dimension.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Dimension Selectors */}
      <div className="space-y-4">
        {getActiveDimensionData().map((dimension) => (
          <Card key={dimension.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span
                    className={`text-sm font-medium ${getDimensionNameColor(dimension.dataType)}`}
                  >
                    {dimension.name}
                  </span>
                  {dimension.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{dimension.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDimension(dimension.id)}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${dimension.name} tag dimension`}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
              <DimensionTagSelector
                dimension={dimension}
                selectedTags={mediaTags?.filter((mt) => mt.tag?.dimensionId === dimension.id) || []}
                onTagsChange={(tagIds) => assignTags(dimension.id, tagIds)}
              />
            </CardContent>
          </Card>
        ))}

        {getActiveDimensionData().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No tag types selected</p>
            <p className="text-xs mt-1">Click on a tag type above to start adding tags</p>
          </div>
        )}
      </div>

      {assignTagsMutation.isPending && (
        <div className="text-sm text-gray-500 mt-4 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          Saving tags...
        </div>
      )}
    </div>
  );
};
