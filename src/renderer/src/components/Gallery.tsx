import { Loader2 } from "lucide-react";
import { Media } from "../../../features/library/shared/types";
import { MediaDisplay } from "./MediaDisplay";
import { ScrollArea } from "./ui/scroll-area";

interface GalleryProps {
  media: Media[];
  scanning: boolean;
  error?: string;
  onMediaSelect: (media: Media) => void;
}

export const Gallery = ({ media, scanning, error, onMediaSelect }: GalleryProps) => {
  if (scanning) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center flex-1">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full pr-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 py-1 pr-1">
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
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
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
  );
};
