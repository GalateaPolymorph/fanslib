import { cn } from "@renderer/lib/utils";
import { Plus } from "lucide-react";
import { type FC, useState } from "react";
import { Media } from "../../../../features/library/entity";
import { useMediaDrag } from "../../contexts/MediaDragContext";
import { useDragOver } from "../../hooks/useDragOver";
import { CreatePostDialog } from "../MediaDetail/CreatePostDialog";

type PostTimelineDropZoneProps = {
  className?: string;
  previousPostDate: Date;
};

export const PostTimelineDropZone: FC<PostTimelineDropZoneProps> = ({
  className,
  previousPostDate,
}) => {
  const { isDragging, draggedMedias, endMediaDrag } = useMediaDrag();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [droppedMedias, setDroppedMedias] = useState<Media[]>([]);

  const { isOver, dragHandlers, setIsOver } = useDragOver({
    onDrop: async () => {
      if (draggedMedias.length === 0) return;
      setDroppedMedias(draggedMedias);
      setIsDialogOpen(true);
      endMediaDrag();
    },
  });

  const handleClose = () => {
    setIsDialogOpen(false);
    setIsOver(false);
  };

  if (!isDragging && !isDialogOpen) {
    return null;
  }

  // Calculate the next day's date
  const nextDate = new Date(previousPostDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return (
    <>
      <div
        className={cn(
          "h-8 mx-4 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors",
          isOver ? "border-primary bg-primary/10" : "border-muted",
          className
        )}
        {...dragHandlers}
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
        initialDate={nextDate}
      />
    </>
  );
};
