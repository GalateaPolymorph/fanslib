import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { type FC } from "react";
import { useLibrary } from "../../contexts/LibraryContext";
import { useMediaDrag } from "../../contexts/MediaDragContext";
import { useShootContext } from "../../contexts/ShootContext";
import { useDragOver } from "../../hooks/useDragOver";

type ShootCreateDropZoneProps = {
  className?: string;
};

export const ShootCreateDropZone: FC<ShootCreateDropZoneProps> = ({ className }) => {
  const { draggedMedias } = useMediaDrag();
  const { refetch: refetchLibrary } = useLibrary();
  const { createShoot } = useShootContext();
  const { isOver, dragHandlers } = useDragOver({
    onDrop: async () => {
      if (draggedMedias.length === 0) return;

      try {
        await createShoot({
          name: `New Shoot - ${format(new Date(), "PPP")}`,
          description: "",
          shootDate: new Date(),
          mediaIds: draggedMedias.map((media) => media.id),
        });
        await refetchLibrary();
      } catch (error) {
        console.error("Failed to create shoot:", error);
      }
    },
  });

  return (
    <div
      className={cn(
        "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-colors",
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
  );
};
