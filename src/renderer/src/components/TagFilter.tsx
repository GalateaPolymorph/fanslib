import { X } from "lucide-react";
import { TagFilter as TagFilterType } from "../../../features/library/api-type";
import { TagSelectionState, TagSelector } from "./TagSelector";
import { Button } from "./ui/button";

type TagFilterProps = {
  dimensionName: string;
  value: TagFilterType;
  onChange: (filter: TagFilterType) => void;
  onRemove: () => void;
  className?: string;
};

export const MediaTagFilter = ({
  dimensionName,
  value,
  onChange,
  onRemove,
  className,
}: TagFilterProps) => {
  // Convert TagFilter to TagSelectionState format
  const getTagStates = (): TagSelectionState[] => {
    if (!value.tagIds?.length) return [];

    return value.tagIds.map((id) => ({
      id,
      state: "selected" as const,
    }));
  };

  // Handle tag selection changes
  const handleTagChange = (
    tagStates: TagSelectionState[] | undefined,
    _changedTagId: string | number
  ) => {
    if (tagStates === undefined) {
      // No tags selected
      onChange({ ...value, tagIds: undefined });
      return;
    }

    if (tagStates.length === 0) {
      // "None" selected - filter for media without any tags in this dimension
      onChange({ ...value, tagIds: [] });
      return;
    }

    // Extract selected tag IDs
    const selectedTagIds = tagStates
      .filter((state) => state.state === "selected")
      .map((state) => state.id as number);

    onChange({ ...value, tagIds: selectedTagIds });
  };

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
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
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
