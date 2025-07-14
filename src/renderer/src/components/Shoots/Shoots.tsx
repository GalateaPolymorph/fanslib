import { ShootCreateDropZone } from "@renderer/components/Shoots/ShootCreateDropZone";
import { ShootDetail } from "@renderer/components/Shoots/ShootDetail";
import { ShootsFilter } from "@renderer/components/ShootsFilter";
import { EmptyState } from "@renderer/components/ui/EmptyState/EmptyState";
import { ErrorState } from "@renderer/components/ui/ErrorState/ErrorState";
import { ScrollArea } from "@renderer/components/ui/ScrollArea";
import { SectionHeader } from "@renderer/components/ui/SectionHeader/SectionHeader";
import { useLibrary } from "@renderer/contexts/LibraryContext";
import { useMediaDrag } from "@renderer/contexts/MediaDragContext";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { useShootContext } from "@renderer/contexts/ShootContext";
import { ShootPreferencesProvider } from "@renderer/contexts/ShootPreferencesContext";
import { useScrollPosition } from "@renderer/hooks";
import { cn } from "@renderer/lib/utils";
import { Camera } from "lucide-react";
import { type FC } from "react";
import { ShootViewSettings } from "./ShootViewSettings";
import { useShootsMedia } from "./useShootsMedia";

type ShootsProps = {
  className?: string;
};

const ShootsContent: FC<ShootsProps> = ({ className }) => {
  const { refetch: refetchLibrary } = useLibrary();
  const { shoots, isLoading, error, refetch } = useShootContext();
  const { isDragging } = useMediaDrag();
  const scrollRef = useScrollPosition<HTMLDivElement>(!isLoading);
  const { allMedia, shootsMedia } = useShootsMedia(shoots);

  if (error) {
    return (
      <div className={className}>
        <ErrorState
          title="Failed to load shoots"
          description={error.message}
          onRetry={() => refetch()}
          showRetry
        />
      </div>
    );
  }

  return (
    <MediaSelectionProvider
      media={new Map(Array.from(allMedia.entries()).map(([key, value]) => [key.viewIndex, value]))}
    >
      <div className={cn(className, "flex h-full flex-col")}>
        <div className="flex-none bg-background p-6">
          <SectionHeader
            title="Shoots"
            description="Organize your media into themed collections"
            actions={<ShootViewSettings />}
          />
          <div className="mt-4">
            <ShootsFilter />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="flex flex-col px-6 pt-4 gap-2 pb-48">
              {shoots.length === 0
                ? !isDragging && (
                    <EmptyState
                      icon={<Camera className="h-12 w-12" />}
                      title="No shoots created"
                      description="Drag media here to create your first shoot and organize your content."
                    />
                  )
                : shoots.map((shoot) => (
                    <ShootDetail
                      key={shoot.id}
                      shoot={shoot}
                      groupedMedia={
                        shootsMedia.get(
                          Array.from(shootsMedia.keys()).find((k) => k.shootId === shoot.id) ?? {
                            shootId: shoot.id,
                            viewIndex: "0",
                          }
                        ) || new Map()
                      }
                      onUpdate={() => {
                        refetch();
                        refetchLibrary();
                      }}
                    />
                  ))}
              <ShootCreateDropZone className="h-24" />
            </div>
          </ScrollArea>
        </div>
      </div>
    </MediaSelectionProvider>
  );
};

export const Shoots: FC<ShootsProps> = (props) => {
  return (
    <ShootPreferencesProvider>
      <ShootsContent {...props} />
    </ShootPreferencesProvider>
  );
};
