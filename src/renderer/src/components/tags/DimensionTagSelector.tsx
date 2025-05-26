import { Plus } from "lucide-react";
import { MediaTag, TagDimension } from "../../../../features/tags/entity";
import { useTagsByDimension } from "../../hooks/tags";
import { Button } from "../ui/button";
import { BooleanTagSelector } from "./BooleanTagSelector";
import { NumericalTagSelector } from "./NumericalTagSelector";
import { TagBadge } from "./TagBadge";

type DimensionTagSelectorProps = {
  dimension: TagDimension;
  selectedTags: MediaTag[];
  onTagsChange: (tagIds: number[]) => void;
  onCreateTag?: () => void;
};

export const DimensionTagSelector = ({
  dimension,
  selectedTags,
  onTagsChange,
  onCreateTag,
}: DimensionTagSelectorProps) => {
  const { data: availableTags, isLoading } = useTagsByDimension(dimension.id);

  const selectedTagIds = selectedTags.map((mt) => mt.tagDefinitionId);

  const toggleTag = (tagId: number) => {
    const newSelection = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    onTagsChange(newSelection);
  };

  // Use specialized selectors for numerical and boolean dimensions
  if (dimension.dataType === "numerical") {
    return (
      <NumericalTagSelector
        dimension={dimension}
        selectedTags={selectedTags}
        onTagsChange={onTagsChange}
      />
    );
  }

  if (dimension.dataType === "boolean") {
    return (
      <BooleanTagSelector
        dimension={dimension}
        selectedTags={selectedTags}
        onTagsChange={onTagsChange}
      />
    );
  }

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-8 rounded"></div>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {availableTags?.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            isSelected={selectedTagIds.includes(tag.id)}
            onClick={() => toggleTag(tag.id)}
          />
        ))}
      </div>

      {dimension.dataType === "categorical" && onCreateTag && (
        <Button variant="outline" size="sm" className="mt-2" onClick={onCreateTag}>
          <Plus className="w-4 h-4 mr-1" />
          Add {dimension.name}
        </Button>
      )}
    </div>
  );
};
