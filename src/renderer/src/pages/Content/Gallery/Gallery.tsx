import { cn } from "@renderer/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Media } from "../../../../../features/library/entity";
import { MediaTile } from "../../../components/MediaTile";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useLibraryPreferences } from "../../../contexts/LibraryPreferencesContext";
import { useMediaDrag } from "../../../contexts/MediaDragContext";
import { useSelection } from "../useSelection";
import { GalleryActionBar } from "./GalleryActionBar";
import { GalleryEmpty } from "./GalleryEmpty";

type GalleryProps = {
  media: Media[];
  error?: string;
  libraryPath?: string;
  onScan: () => void;
  onUpdate: () => void;
};

export const Gallery = ({ media, error, libraryPath, onScan, onUpdate }: GalleryProps) => {
  const navigate = useNavigate();
  const { preferences } = useLibraryPreferences();
  const { handleDragStart, handleDragEnd } = useMediaDrag();

  const [currentHoveredIndex, setCurrentHoveredIndex] = useState<number | null>(null);
  const {
    selectedMediaIds,
    selectedCategories,
    isSelected,
    toggleMediaSelection,
    clearSelection,
    lastClickedIndex,
    isShiftPressed,
  } = useSelection({ media });

  const handleMouseEnter = (mediaId: string) => {
    const currentIndex = media.findIndex((m) => m.id === mediaId);
    setCurrentHoveredIndex(currentIndex);
  };

  const handleMouseLeave = () => {
    setCurrentHoveredIndex(null);
  };

  const isHighlighted = (index: number) => {
    if (lastClickedIndex === null || currentHoveredIndex === null) return false;
    if (selectedMediaIds.size === 0) return false;
    if (!isShiftPressed) return false;

    const highlighted =
      index >= Math.min(lastClickedIndex, currentHoveredIndex) &&
      index <= Math.max(lastClickedIndex, currentHoveredIndex);

    return highlighted;
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const selectedMediaItems = media.filter((m) => selectedMediaIds.has(m.id));

  return (
    <div className="h-full">
      <GalleryActionBar
        selectedCount={selectedMediaIds.size}
        selectedCategories={selectedCategories}
        selectedMedia={selectedMediaItems}
        onClearSelection={clearSelection}
        onUpdate={onUpdate}
      />
      <ScrollArea className="h-[calc(100%-3rem)]">
        <div
          className={cn(
            "grid gap-4 p-4",
            preferences.view.gridSize === "large"
              ? "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
              : "grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12"
          )}
        >
          {media.map((media, index) => (
            <div
              key={media.id}
              draggable
              onDragStart={(e) => handleDragStart(e, media)}
              onDragEnd={handleDragEnd}
              onMouseEnter={() => handleMouseEnter(media.id)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                if (selectedMediaIds.size > 0) {
                  toggleMediaSelection(media.id, e);
                } else if (!(e.target as HTMLElement).closest(".selection-circle")) {
                  navigate(`/content/${encodeURIComponent(media.id)}`);
                }
              }}
              className={cn(
                "relative rounded-lg overflow-hidden cursor-pointer group aspect-square",
                isHighlighted(index) && "ring-2 ring-primary/50"
              )}
            >
              <div
                className={cn("absolute inset-0", {
                  "bg-primary/5": isSelected(media.id),
                })}
              >
                <MediaTile
                  className={cn("transition-transform duration-80 ease-in-out", {
                    "bg-primary/5": isSelected(media.id),
                  })}
                  media={media}
                  isActivePreview={index === currentHoveredIndex}
                />
              </div>
              <div
                className={cn(
                  "selection-circle absolute top-2 right-2 w-5 h-5 rounded-full",
                  "transition-opacity duration-200",
                  "flex items-center justify-center",
                  "border-2 cursor-pointer",
                  "hover:opacity-100 group-hover:opacity-100",
                  {
                    "opacity-100 bg-primary border-primary text-primary-foreground": isSelected(
                      media.id
                    ),
                    "opacity-0 bg-background/80 border-foreground/20 hover:border-foreground/40":
                      !isSelected(media.id),
                  }
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMediaSelection(media.id, e);
                }}
              >
                {selectedMediaIds.has(media.id) && <Check className="w-3 h-3" />}
              </div>
            </div>
          ))}
          {media.length === 0 && <GalleryEmpty libraryPath={libraryPath} onScan={onScan} />}
        </div>
      </ScrollArea>
    </div>
  );
};
