import { X } from "lucide-react";
import type { TagFilter as TagFilterType } from "../../../../../features/library/api-type";
import { TagSelector } from "../../TagSelector";
import { Button } from "../../ui/button";

type TagSelectionState = {
  id: string | number;
  state: "selected" | "half-selected" | "unselected";
};

type TagFilterContentProps = {
  dimensionName: string;
  filter: TagFilterType;
  onUpdate: (dimensionName: string, filter: TagFilterType) => void;
  onRemove: (dimensionName: string) => void;
};

export const TagFilterContent = ({
  dimensionName,
  filter,
  onUpdate,
  onRemove,
}: TagFilterContentProps) => {
  const getTagStates = (): TagSelectionState[] => {
    if (!filter.tagIds?.length) return [];

    return filter.tagIds.map((id) => ({
      id,
      state: "selected" as const,
    }));
  };

  const handleTagChange = (
    tagStates: TagSelectionState[] | undefined,
    _changedTagId: string | number
  ) => {
    if (tagStates === undefined) {
      onUpdate(dimensionName, { ...filter, tagIds: undefined });
      return;
    }

    if (tagStates.length === 0) {
      onUpdate(dimensionName, { ...filter, tagIds: [] });
      return;
    }

    const selectedTagIds = tagStates
      .filter((state) => state.state === "selected")
      .map((state) => state.id as number);

    onUpdate(dimensionName, { ...filter, tagIds: selectedTagIds });
  };

  return (
    <div className="flex items-center gap-2 group">
      <div className="flex-1">
        <TagSelector
          dimensionName={dimensionName}
          value={getTagStates()}
          onChange={handleTagChange}
          multiple={true}
          includeNoneOption={true}
        />
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={() => onRemove(dimensionName)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
