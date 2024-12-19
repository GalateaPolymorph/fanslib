import { cn } from "@renderer/lib/utils";
import { Check, Grid2X2, Grid3X3, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Media } from "../../../../features/library/entity";
import { CategorySelect } from "../../components/CategorySelect";
import { MediaTile } from "../../components/MediaTile";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { GalleryEmpty } from "./GalleryEmpty";

type GridSize = "small" | "large";

type GridSizeToggleProps = {
  gridSize: GridSize;
  setGridSize: (size: GridSize) => void;
};

export const GridSizeToggle = ({ gridSize, setGridSize }: GridSizeToggleProps) => (
  <ToggleGroup
    type="single"
    value={gridSize}
    onValueChange={(value) => value && setGridSize(value as GridSize)}
  >
    <ToggleGroupItem value="small" aria-label="Small grid">
      <Grid3X3 className="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="large" aria-label="Large grid">
      <Grid2X2 className="h-4 w-4" />
    </ToggleGroupItem>
  </ToggleGroup>
);

type GalleryProps = {
  media: Media[];
  error?: string;
  libraryPath?: string;
  onScan: () => void;
  onUpdate: () => void;
  gridSize: GridSize;
};

export const Gallery = ({
  media,
  error,
  libraryPath,
  onScan,
  onUpdate,
  gridSize,
}: GalleryProps) => {
  const navigate = useNavigate();
  const [selectedMediaIds, setSelectedMediaIds] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [currentHoveredIndex, setCurrentHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    // Handle case where user switches windows while holding shift
    const handleBlur = () => {
      setIsShiftPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [lastClickedIndex, currentHoveredIndex]);

  useEffect(() => {
    // When media items are filtered out (e.g. by category), remove them from selection
    // If all selected items are filtered out, clear the entire selection state
    const mediaIds = new Set(media.map((m) => m.id));
    const newSelectedIds = new Set(Array.from(selectedMediaIds).filter((id) => mediaIds.has(id)));

    if (newSelectedIds.size !== selectedMediaIds.size) {
      setSelectedMediaIds(newSelectedIds);
      if (newSelectedIds.size === 0) {
        setSelectedCategories([]);
        setLastClickedIndex(null);
      }
    }
  }, [media]);

  const getIndexRange = (index1: number, index2: number) => {
    const start = Math.min(index1, index2);
    const end = Math.max(index1, index2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const toggleMediaSelection = (mediaId: string, event: React.MouseEvent) => {
    event.preventDefault();
    const currentIndex = media.findIndex((m) => m.id === mediaId);

    // Multi-selection (shift + click)
    if (isShiftPressed && lastClickedIndex !== null) {
      const indices = getIndexRange(lastClickedIndex, currentIndex);
      setSelectedMediaIds((prev) => {
        const newSelection = new Set(prev);
        indices.forEach((i) => {
          if (i >= 0 && i < media.length) {
            newSelection.add(media[i].id);
          }
        });
        return newSelection;
      });
      setLastClickedIndex(currentIndex);
      return;
    }

    // Single selection
    setSelectedMediaIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(mediaId)) {
        newSelection.delete(mediaId);
      } else {
        newSelection.add(mediaId);
      }
      return newSelection;
    });
    setLastClickedIndex(currentIndex);
  };

  const handleMouseEnter = (mediaId: string) => {
    const currentIndex = media.findIndex((m) => m.id === mediaId);
    setCurrentHoveredIndex(currentIndex);
  };

  const handleMouseLeave = () => {
    setCurrentHoveredIndex(null);
  };

  const handleCategoryChange = async (categoryIds: string[]) => {
    const lastChanged =
      categoryIds.length > selectedCategories.length
        ? categoryIds.find((id) => !selectedCategories.includes(id))
        : selectedCategories.find((id) => !categoryIds.includes(id));

    if (!lastChanged || !selectedMediaIds.size) return;

    const allHaveCategory = media
      .filter((m) => selectedMediaIds.has(m.id))
      .every((media) => media.categories.some((cat) => cat.id === lastChanged));

    await Promise.all(
      media
        .filter((m) => selectedMediaIds.has(m.id))
        .map((media) => {
          const updatedCategoryIds = allHaveCategory
            ? media.categories.filter((cat) => cat.id !== lastChanged).map((cat) => cat.id)
            : [...media.categories.map((cat) => cat.id), lastChanged];

          return window.api["library:update"](media.id, {
            categoryIds: updatedCategoryIds,
          });
        })
    );

    setSelectedCategories(categoryIds);
    onUpdate();
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const isHighlighted = (index: number) => {
    if (lastClickedIndex === null || currentHoveredIndex === null) return false;
    if (selectedMediaIds.size === 0) return false;
    if (!isShiftPressed) return false;

    const highlighted =
      index >= Math.min(lastClickedIndex, currentHoveredIndex) &&
      index <= Math.max(lastClickedIndex, currentHoveredIndex);

    return highlighted;
  };

  const isSelected = (mediaId: string) => {
    return selectedMediaIds.has(mediaId);
  };
  return (
    <div className="h-full relative">
      <ScrollArea className="h-full absolute inset-0">
        <div
          className={cn(
            "grid gap-4 p-4",
            gridSize === "large"
              ? "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
              : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
          )}
        >
          {media.map((media, index) => (
            <div key={media.path} className="relative">
              <div
                className={cn(
                  "group relative aspect-square bg-muted rounded-lg ring-2 overflow-hidden cursor-pointer",
                  "transition-all duration-200",
                  isSelected(media.id)
                    ? "ring-primary"
                    : isHighlighted(index)
                      ? "ring-primary/50"
                      : "ring-transparent"
                )}
                onClick={(e) => {
                  if (selectedMediaIds.size > 0) {
                    toggleMediaSelection(media.id, e);
                  } else if (!(e.target as HTMLElement).closest(".selection-circle")) {
                    navigate(`/content/${encodeURIComponent(media.id)}`);
                  }
                }}
                onMouseEnter={() => handleMouseEnter(media.id)}
                onMouseLeave={() => handleMouseLeave()}
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
            </div>
          ))}
          {media.length === 0 && <GalleryEmpty libraryPath={libraryPath} onScan={onScan} />}
        </div>
      </ScrollArea>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
        <div
          className={cn(
            "w-[60%] bg-background",
            "border shadow-lg rounded-lg",
            "p-6",
            "flex items-center justify-between",
            "transform transition-all duration-300 ease-out",
            selectedMediaIds.size > 0
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="text-base font-medium">
              {selectedMediaIds.size} {selectedMediaIds.size === 1 ? "item" : "items"} selected
            </div>
            <button
              onClick={() => {
                setSelectedMediaIds(new Set());
                setSelectedCategories([]);
                setLastClickedIndex(null);
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-md",
                "text-sm font-medium",
                "h-9 px-3",
                "border border-input bg-background",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors"
              )}
            >
              <X className="h-4 w-4 mr-2" />
              Clear selection
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Assign category</div>
            <CategorySelect
              value={selectedCategories}
              onChange={handleCategoryChange}
              multiple={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
