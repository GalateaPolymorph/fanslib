import { CreateShootDialog } from "@renderer/components/Shoots/CreateShootDialog";
import { Button } from "@renderer/components/ui/Button";
import { cn } from "@renderer/lib/utils";
import { TagAssigner } from "@renderer/pages/Manage/Gallery/GalleryActionBar/TagAssigner";
import { CreatePostDialog } from "@renderer/pages/MediaDetail/CreatePostDialog";
import { Camera, Send, X } from "lucide-react";
import { useState } from "react";
import { Media } from "../../../../../../features/library/entity";

type GalleryActionBarProps = {
  selectedCount: number;
  selectedMedia: Media[];
  onClearSelection: () => void;
};

export const GalleryActionBar = ({
  selectedCount,
  selectedMedia,
  onClearSelection,
}: GalleryActionBarProps) => {
  const [isCreateShootDialogOpen, setIsCreateShootDialogOpen] = useState(false);
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);

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
        <div className="flex gap-4 row-span-2 items-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsCreateShootDialogOpen(true)}
          >
            <Camera className="h-4 w-4" />
            Create Shoot
          </Button>

          <TagAssigner selectedMedia={selectedMedia} />

          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => setIsCreatePostDialogOpen(true)}
          >
            <Send className="h-4 w-4" />
            Create Post
          </Button>
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

      <CreateShootDialog
        open={isCreateShootDialogOpen}
        onOpenChange={setIsCreateShootDialogOpen}
        selectedMedia={selectedMedia}
        onSuccess={onClearSelection}
      />

      <CreatePostDialog
        open={isCreatePostDialogOpen}
        onOpenChange={setIsCreatePostDialogOpen}
        media={selectedMedia}
      />
    </div>
  );
};
