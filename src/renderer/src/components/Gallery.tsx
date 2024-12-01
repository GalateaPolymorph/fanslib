import { cn } from "@renderer/lib/utils";
import { Grid2X2, Grid3X3, Loader2 } from "lucide-react";
import { createContext, useContext } from "react";
import { Media } from "../../../lib/database/media/type";
import { MediaDisplay } from "./MediaDisplay";
import { ScrollArea } from "./ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface GalleryProps {
  media: Media[];
  scanning: boolean;
  error?: string;
  onMediaSelect: (media: Media) => void;
}

export type GridSize = "large" | "small";
export const GridSizeContext = createContext<{
  gridSize: GridSize;
  setGridSize: (size: GridSize) => void;
}>({
  gridSize: "large",
  setGridSize: () => {},
});

export const GridSizeToggle = () => {
  const { gridSize, setGridSize } = useContext(GridSizeContext);

  return (
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
};

export const Gallery = ({ media, scanning, error, onMediaSelect }: GalleryProps) => {
  const { gridSize } = useContext(GridSizeContext);

  if (scanning) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <ScrollArea className="h-full absolute inset-0">
        <div
          className={cn(
            "grid gap-4 py-1",
            gridSize === "large"
              ? "grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
              : "grid-cols-[repeat(auto-fill,minmax(120px,1fr))]"
          )}
        >
          {media.map((media) => (
            <div className="relative" key={media.path}>
              {media.isNew && (
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full z-10"
                  title="New Media"
                />
              )}
              <div
                className="group relative aspect-square rounded-xl overflow-hidden border-3 border-transparent transition-colors cursor-pointer"
                onClick={() => onMediaSelect(media)}
                onMouseEnter={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  if (media.categories && media.categories.length > 0) {
                    element.style.borderColor = media.categories[0].color;
                  } else {
                    element.style.borderColor = "hsl(var(--primary))";
                  }
                }}
                onMouseLeave={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  element.style.borderColor = "transparent";
                }}
              >
                <MediaDisplay media={media} />
                {media.categories && media.categories.length > 0 && (
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {media.categories.map((category) => (
                      <div
                        key={category.slug}
                        className="w-4 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                        title={category.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {media.length === 0 && !scanning && (
            <div className="col-span-full text-center text-muted-foreground p-4">
              No media files found in the library matching the selected filters.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
