import { Button } from "@renderer/components/ui/Button";
import { RefreshCw } from "lucide-react";

type GalleryEmptyProps = {
  libraryPath?: string;
  onScan?: () => void;
};

export const GalleryEmpty = ({ libraryPath, onScan }: GalleryEmptyProps) => {
  if (!libraryPath) {
    return (
      <div className="col-span-full text-center text-muted-foreground p-4">
        No library path set. Please configure your library path in settings.
      </div>
    );
  }

  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 p-8">
      <p className="text-muted-foreground">
        No media files found in the library matching the selected filters.
      </p>
      {onScan && (
        <Button onClick={onScan} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Scan Library
        </Button>
      )}
    </div>
  );
};
