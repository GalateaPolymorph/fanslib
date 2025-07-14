import { Button } from "@renderer/components/ui/Button";
import { EmptyState } from "@renderer/components/ui/EmptyState/EmptyState";
import { RefreshCw, FolderOpen, Settings } from "lucide-react";

type GalleryEmptyProps = {
  libraryPath?: string;
  onScan?: () => void;
};

export const GalleryEmpty = ({ libraryPath, onScan }: GalleryEmptyProps) => {
  if (!libraryPath) {
    return (
      <div className="col-span-full">
        <EmptyState
          icon={<Settings className="h-12 w-12" />}
          title="No library path set"
          description="Please configure your library path in settings to view media files."
          padding="lg"
        />
      </div>
    );
  }

  return (
    <div className="col-span-full">
      <EmptyState
        icon={<FolderOpen className="h-12 w-12" />}
        title="No media files found"
        description="No media files found in the library matching the selected filters."
        action={
          onScan && (
            <Button onClick={onScan} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Scan Library
            </Button>
          )
        }
        padding="lg"
      />
    </div>
  );
};
