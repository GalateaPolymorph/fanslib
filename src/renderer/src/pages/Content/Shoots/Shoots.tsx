import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { type FC } from "react";
import { useLibrary } from "../../../contexts/LibraryContext";
import { useMediaDrag } from "../../../contexts/MediaDragContext";
import { useShootContext } from "../../../contexts/ShootContext";
import { ShootDetail } from "./ShootDetail";

type ShootsProps = {
  className?: string;
};

export const Shoots: FC<ShootsProps> = ({ className }) => {
  const { refetch: refetchLibrary } = useLibrary();
  const { shoots, isLoading, error, createShoot, refetch } = useShootContext();
  const { isDragging, draggedMedia } = useMediaDrag();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    try {
      await createShoot({
        name: `New Shoot - ${format(new Date(), "PPP")}`,
        description: "",
        shootDate: new Date(),
        mediaIds: [draggedMedia.id],
      });
      refetchLibrary();
    } catch (error) {
      console.error("Failed to create shoot:", error);
    }
  };

  if (isLoading) {
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
    <div
      className={cn(className, "relative h-full")}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col px-4 pt-4 gap-2 pb-48">
          {isDragging && (
            <div className="h-24 bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
              <span className="text-primary">Drop here to create new shoot</span>
            </div>
          )}
          {shoots.length > 0
            ? shoots.map((shoot) => (
                <ShootDetail
                  key={shoot.id}
                  shoot={shoot}
                  onUpdate={() => {
                    refetch();
                    refetchLibrary();
                  }}
                />
              ))
            : !isDragging && (
                <div className="text-center text-muted-foreground py-8">
                  Drag media here to create your first shoot
                </div>
              )}
        </div>
      </ScrollArea>
    </div>
  );
};
