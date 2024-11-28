import { Loader2 } from "lucide-react";
import { MediaFile } from "../../../features/library/shared/types";
import { formatFileSize } from "../lib/utils";
import { Media } from "./Media";
import { ScrollArea } from "./ui/scroll-area";

interface GalleryProps {
  mediaFiles: MediaFile[];
  scanning: boolean;
  error?: string;
  onMediaSelect: (media: MediaFile) => void;
}

export const Gallery = ({ mediaFiles, scanning, error, onMediaSelect }: GalleryProps) => {
  return (
    <div className="p-8 flex flex-col w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Your Library</h1>
          <p className="text-muted-foreground">
            {error ? error : `Found ${mediaFiles.length} media files in your library`}
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {mediaFiles.map((file) => (
                <div
                  key={file.path}
                  className="group relative aspect-square rounded-lg overflow-hidden border bg-muted hover:border-primary transition-colors cursor-pointer"
                  onClick={() => onMediaSelect(file)}
                >
                  <Media file={file} />
                  <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              ))}
              {mediaFiles.length === 0 && !scanning && (
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
