import { Loader2 } from "lucide-react";
import { Media } from "../../../features/library/shared/types";
import { formatFileSize } from "../lib/utils";
import { MediaDisplay } from "./MediaDisplay";
import { ScrollArea } from "./ui/scroll-area";

interface GalleryProps {
  media: Media[];
  scanning: boolean;
  error?: string;
  onMediaSelect: (media: Media) => void;
}

export const Gallery = ({ media, scanning, error, onMediaSelect }: GalleryProps) => {
  return (
    <div className="p-8 flex flex-col w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">My content</h1>
          <p className="text-muted-foreground">
            {error ? error : `Found ${media.length} media files in your library`}
          </p>
        </div>
      </div>

      {scanning ? (
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        !error && (
          <ScrollArea className="w-full pr-4">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 py-1 pr-1">
              {media.map((media) => (
                <div className="relative">
                  {media.isNew && (
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary/50 rounded-full z-10"
                      title="New Media"
                    />
                  )}
                  <div
                    key={media.path}
                    className="group relative aspect-square rounded-lg overflow-hidden border bg-muted hover:border-primary transition-colors cursor-pointer"
                    onClick={() => onMediaSelect(media)}
                  >
                    <MediaDisplay media={media} />
                    <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-sm font-medium truncate" title={media.name}>
                        {media.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(media.size)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {media.length === 0 && !scanning && (
                <div className="col-span-full text-center text-muted-foreground p-4">
                  No media files found in the library
                </div>
              )}
            </div>
          </ScrollArea>
        )
      )}
    </div>
  );
};
