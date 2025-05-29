import { Button } from "@renderer/components/ui/button";
import { useTagsByDimension } from "@renderer/hooks/api/tags/useTagDefinitions";
import { SelectionState } from "@renderer/lib/selection-state";
import { Plus } from "lucide-react";
import { TagDimension } from "../../../../../features/tags/entity";
import { BooleanTagSelector } from "./BooleanTagSelector";
import { NumericalTagSelector } from "./NumericalTagSelector";
import { TagBadge } from "./TagBadge";

type DimensionTagSelectorProps = {
  dimension: TagDimension;
  tagStates: Record<number, SelectionState>;
  onTagToggle: (tagId: number, currentState: SelectionState) => void;
  onCreateTag?: () => void;
};

export const DimensionTagSelector = ({
  dimension,
  tagStates,
  onTagToggle,
  onCreateTag,
}: DimensionTagSelectorProps) => {
  const { data: availableTags, isLoading } = useTagsByDimension(dimension.id);

  const handleTagToggle = (tagId: number) => {
    const currentState = tagStates[tagId] || "unchecked";
    onTagToggle(tagId, currentState);
  };

  if (dimension.dataType === "numerical") {
    return <NumericalTagSelector dimension={dimension} selectedTags={[]} onTagsChange={() => {}} />;
  }

  if (dimension.dataType === "boolean") {
    return <BooleanTagSelector dimension={dimension} selectedTags={[]} onTagsChange={() => {}} />;
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
            selectionState={tagStates[tag.id] || "unchecked"}
            onClick={() => handleTagToggle(tag.id)}
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
