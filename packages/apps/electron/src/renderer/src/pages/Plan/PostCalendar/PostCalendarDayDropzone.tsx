import { useMediaDrag } from "@renderer/contexts/MediaDragContext";
import { useDragOver } from "@renderer/hooks";
import { cn } from "@renderer/lib/utils";
import { CreatePostDialog } from "@renderer/pages/MediaDetail/CreatePostDialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Media } from "src/features/library/entity";

type PostCalendarDayDropzoneProps = {
  date: Date;
  onUpdate: () => Promise<void>;
};

export const PostCalendarDayDropzone = ({ date }: PostCalendarDayDropzoneProps) => {
  const { isDragging, draggedMedias, endMediaDrag } = useMediaDrag();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [droppedMedias, setDroppedMedias] = useState<Media[]>([]);

  const { isOver, dragHandlers } = useDragOver({
    onDrop: async () => {
      if (draggedMedias.length === 0) return;
      setDroppedMedias(draggedMedias);
      setIsDialogOpen(true);
      endMediaDrag();
    },
  });

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  if (!isDragging && !isDialogOpen) {
    return null;
  }

  return (
    <>
      <div
        {...dragHandlers}
        className={cn(
          "h-8 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors mt-2",
          isOver ? "border-primary bg-primary/10" : "border-muted"
        )}
      >
        <Plus
          className={cn(
            "h-4 w-4 transition-colors",
            isOver ? "text-primary" : "text-muted-foreground"
          )}
        />
      </div>

      <CreatePostDialog
        open={isDialogOpen}
        onOpenChange={handleClose}
        media={droppedMedias}
        initialDate={date}
      />
    </>
  );
};
