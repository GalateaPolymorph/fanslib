import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { type FC } from "react";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useMediaDrag } from "../../../contexts/MediaDragContext";
import { useShoots } from "../../../hooks/useShoots";
import { ShootDetail } from "./ShootDetail";

type ShootsProps = {
  className?: string;
};

export const Shoots: FC<ShootsProps> = ({ className }) => {
  const { shoots, loading, error, createShoot, refetch } = useShoots();
  const { isDragging, draggedMedia } = useMediaDrag();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    try {
      const newShoot = await createShoot({
        name: `New Shoot - ${format(new Date(), "PPP")}`,
        description: "",
        shootDate: new Date(),
        mediaIds: [draggedMedia.id],
      });

      // Handle successful shoot creation
      console.log("New shoot created:", newShoot);
    } catch (error) {
      console.error("Failed to create shoot:", error);
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="p-4">Loading shoots...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="p-4 text-destructive">Error loading shoots: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={cn(className, "relative")} onDragOver={handleDragOver} onDrop={handleDrop}>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {shoots.length > 0
            ? shoots.map((shoot) => <ShootDetail key={shoot.id} shoot={shoot} onUpdate={refetch} />)
            : !isDragging && (
                <div className="text-center text-muted-foreground py-8">
                  Drag media here to create your first shoot
                </div>
              )}
          {isDragging && (
            <div className="h-24 bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
              <span className="text-primary">Drop here to create new shoot</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
