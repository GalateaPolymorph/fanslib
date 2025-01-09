import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Media } from "../../../../../features/library/entity";
import { CategorySelect } from "../../../components/CategorySelect";
import { CreateShootDialog } from "../../../components/Shoots/CreateShootDialog";

type GalleryActionBarProps = {
  selectedCount: number;
  selectedCategories: string[];
  selectedMedia: Media[];
  onClearSelection: () => void;
  onUpdate: () => void;
};

export const GalleryActionBar = ({
  selectedCount,
  selectedCategories,
  selectedMedia,
  onClearSelection,
  onUpdate,
}: GalleryActionBarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (selectedCount === 0) return null;

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

  return (
    <>
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
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Assign category</div>
              <CategorySelect
                value={selectedCategories}
                onChange={handleCategoryChange}
                multiple={true}
              />
            </div>
            <div>
              <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Shoot
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CreateShootDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedMedia={selectedMedia}
        onSuccess={onClearSelection}
      />
    </>
  );
};
