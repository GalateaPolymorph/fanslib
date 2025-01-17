import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";
import { X } from "lucide-react";
import { Media } from "../../../../../../features/library/entity";
import { GalleryCategorySelect } from "./GalleryCategorySelect";
import { GalleryTagSelect } from "./GalleryTagSelect";

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

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
      <div
        className={cn(
          "w-[70%] bg-background",
          "border shadow-lg rounded-lg",
          "p-4",
          "grid grid-rows-[auto_auto] grid-cols-[1fr_auto] items-center justify-between",
          "transform transition-all duration-300 ease-out",
          selectedCount > 0
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="flex gap-4 row-span-2">
          <GalleryTagSelect selectedMedia={selectedMedia} onUpdate={onUpdate} />
          <GalleryCategorySelect selectedMedia={selectedMedia} onUpdate={onUpdate} />
        </div>
        <div className="flex items-center justify-end gap-3 w-full">
          <div className="text-sm text-muted-foreground">
            {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
          </div>
          <Button variant="ghost" size="icon" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
