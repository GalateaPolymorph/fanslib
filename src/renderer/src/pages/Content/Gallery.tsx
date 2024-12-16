import { cn } from "@renderer/lib/utils";
import { Grid2X2, Grid3X3 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Media } from "../../../../features/library/entity";
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
  onScan?: () => void;
  gridSize: GridSize;
};
export const Gallery = ({ media, error, libraryPath, onScan, gridSize }: GalleryProps) => {
  const navigate = useNavigate();
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

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
          {media.map((media) => (
            <div key={media.path} className="relative">
              <div
                className="group relative border-2 border-transparent aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/content/${encodeURIComponent(media.id)}`)}
                onMouseEnter={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  if (media.categories && media.categories.length > 0) {
                    element.style.borderColor = media.categories[0].color;
                  } else {
                    element.style.borderColor = "hsl(var(--primary))";
                  }
                  if (media.type === "video") {
                    setActivePreviewId(media.id);
                  }
                }}
                onMouseLeave={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  element.style.borderColor = "transparent";
                  if (media.type === "video") {
                    setActivePreviewId(null);
                  }
                }}
              >
                <div className="absolute inset-0">
                  <MediaTile media={media} isActivePreview={media.id === activePreviewId} />
                </div>
              </div>
            </div>
          ))}
          {media.length === 0 && <GalleryEmpty libraryPath={libraryPath} onScan={onScan} />}
        </div>
      </ScrollArea>
    </div>
  );
};
