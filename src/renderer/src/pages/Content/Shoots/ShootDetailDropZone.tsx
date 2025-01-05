import { cn } from "@renderer/lib/utils";
import { Plus } from "lucide-react";
import { type FC, useState } from "react";
import { ShootWithMedia } from "../../../../../features/shoots/api-type";
import { useLibrary } from "../../../contexts/LibraryContext";
import { useMediaDrag } from "../../../contexts/MediaDragContext";

type ShootDetailDropZoneProps = {
  shoot: ShootWithMedia;
  onUpdate: () => void;
};

export const ShootDetailDropZone: FC<ShootDetailDropZoneProps> = ({ shoot, onUpdate }) => {
  const { draggedMedia } = useMediaDrag();
  const [isOver, setIsOver] = useState(false);
  const { refetch: refetchLibrary } = useLibrary();

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

    if (!draggedMedia) return;

    try {
      await window.api["shoot:update"](shoot.id, {
        mediaIds: [...(shoot.media?.map((m) => m.id) || []), draggedMedia.id],
      });
      onUpdate();
      await refetchLibrary();
    } catch (error) {
      console.error("Failed to add media to shoot:", error);
    }
  };

  return (
    <div
      className={cn(
        "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-colors",
        isOver ? "border-primary bg-primary/10" : "border-muted"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Plus className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};
