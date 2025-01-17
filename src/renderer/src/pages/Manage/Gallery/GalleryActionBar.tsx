import { cn } from "@renderer/lib/utils";
import { X } from "lucide-react";
import { Media } from "../../../../../features/library/entity";
import { CategorySelect } from "../../../components/CategorySelect";
import { TagSelect, TagSelectionState } from "../../../components/TagSelect";

type GalleryActionBarProps = {
  selectedCount: number;
  selectedMedia: Media[];
  onClearSelection: () => void;
  onUpdate: () => void;
};

export const GalleryActionBar = ({
  selectedCount,
  selectedMedia,
  onClearSelection,
  onUpdate,
}: GalleryActionBarProps) => {
  if (selectedCount === 0) return null;

  const selectedCategories = selectedMedia.flatMap((media) =>
    media.categories.map((cat) => cat.id)
  );

  const getTagStates = (): TagSelectionState[] => {
    const tagCounts = new Map<number, number>();

    // Count how many media items have each tag
    selectedMedia.forEach((media) => {
      media.tags.forEach((tag) => {
        tagCounts.set(tag.id, (tagCounts.get(tag.id) ?? 0) + 1);
      });
    });

    // Convert counts to states
    return Array.from(tagCounts.entries()).map(([id, count]) => ({
      id,
      state: count === selectedMedia.length ? "selected" : "half-selected",
    }));
  };

  const handleCategoryChange = async (categoryIds: string[]) => {
    const lastChanged =
      categoryIds.length > selectedCategories.length
        ? categoryIds.find((id) => !selectedCategories.includes(id))
        : selectedCategories.find((id) => !categoryIds.includes(id));

    if (!lastChanged || selectedCount === 0) return;

    const allHaveCategory = selectedMedia.every((media) =>
      media.categories.some((cat) => cat.id === lastChanged)
    );

    await Promise.all(
      selectedMedia.map((media) => {
        const updatedCategoryIds = allHaveCategory
          ? media.categories.filter((cat) => cat.id !== lastChanged).map((cat) => cat.id)
          : [...media.categories.map((cat) => cat.id), lastChanged];

        return window.api["library:update"](media.id, {
          categoryIds: updatedCategoryIds,
        });
      })
    );

    onUpdate();
  };

  const handleTagChange = async (
    tagStates: TagSelectionState[] | undefined,
    changedTagId: number
  ) => {
    if (!tagStates || selectedCount === 0 || changedTagId === -1) return;

    const allHaveTag = selectedMedia.every((media) =>
      media.tags.some((tag) => tag.id === changedTagId)
    );

    await Promise.all(
      selectedMedia.map((media) => {
        const updatedTagIds = allHaveTag
          ? media.tags.filter((tag) => tag.id !== changedTagId).map((tag) => tag.id)
          : [...media.tags.map((tag) => tag.id), changedTagId];

        return window.api["library:updateTags"](media.id, updatedTagIds);
      })
    );

    onUpdate();
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
      <div
        className={cn(
          "w-[60%] bg-background",
          "border shadow-lg rounded-lg",
          "p-6",
          "flex items-center justify-between",
          "transform transition-all duration-300 ease-out",
          selectedCount > 0
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="text-base font-medium">
            {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
          </div>
          <button
            onClick={onClearSelection}
            className={cn(
              "inline-flex items-center justify-center rounded-md",
              "text-sm font-medium",
              "h-9 px-3",
              "border border-input bg-background",
              "hover:bg-accent hover:text-accent-foreground",
              "transition-colors"
            )}
          >
            <X className="h-4 w-4 mr-2" />
            Clear selection
          </button>
        </div>
        <div className="flex gap-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Assign category</div>
            <CategorySelect
              value={selectedCategories}
              onChange={handleCategoryChange}
              multiple={true}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Assign tags</div>
            <TagSelect value={getTagStates()} onChange={handleTagChange} multiple={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
