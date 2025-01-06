import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { type FC, useState } from "react";
import { useLibrary } from "../../contexts/LibraryContext";
import { useMediaDrag } from "../../contexts/MediaDragContext";
import { useShootContext } from "../../contexts/ShootContext";

type ShootCreateDropZoneProps = {
  className?: string;
};

export const ShootCreateDropZone: FC<ShootCreateDropZoneProps> = ({ className }) => {
  const { draggedMedias } = useMediaDrag();
  const [isOver, setIsOver] = useState(false);
  const { refetch: refetchLibrary } = useLibrary();
  const { createShoot } = useShootContext();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

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
  };

  return (
    <div
      className={cn(
        "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-colors",
        isOver ? "border-primary bg-primary/10" : "border-muted",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
