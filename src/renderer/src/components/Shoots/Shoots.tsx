import { ShootsFilter } from "@renderer/components/ShootsFilter";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { cn } from "@renderer/lib/utils";
import { type FC } from "react";
import { useLibrary } from "../../contexts/LibraryContext";
import { useMediaDrag } from "../../contexts/MediaDragContext";
import { useShootContext } from "../../contexts/ShootContext";
import { usePersistentScrollPosition } from "../../hooks/usePersistentScrollPosition";
import { ShootCreateDropZone } from "./ShootCreateDropZone";
import { ShootDetail } from "./ShootDetail";

type ShootsProps = {
  className?: string;
};

export const Shoots: FC<ShootsProps> = ({ className }) => {
  const { refetch: refetchLibrary } = useLibrary();
  const { shoots, isLoading, error, refetch } = useShootContext();
  const { isDragging } = useMediaDrag();
  const scrollRef = usePersistentScrollPosition<HTMLDivElement>([shoots, isLoading]);

  if (error) {
    return (
      <div className={className}>
        <div className="p-4 text-destructive">Error loading shoots: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={cn(className, "flex h-full flex-col")}>
      <div className="flex-none bg-background p-6">
        <ShootsFilter />
      </div>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="flex flex-col px-6 pt-4 gap-2 pb-48">
            {shoots.length === 0 ? (
              !isDragging && (
                <div className="text-center text-muted-foreground py-8">
                  Drag media here to create your first shoot
                </div>
              )
            ) : (
              <>
                {shoots.map((shoot) => (
                  <ShootDetail
                    key={shoot.id}
                    shoot={shoot}
                    onUpdate={() => {
                      refetch();
                      refetchLibrary();
                    }}
                  />
                ))}
                <ShootCreateDropZone className="h-24" />
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
