import { cn } from "@renderer/lib/utils";
import { Media } from "../../../../../features/library/entity";
import { MediaTile } from "../../../components/MediaTile";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useLibraryPreferences } from "../../../contexts/LibraryPreferencesContext";
import { MediaSelectionProvider, useMediaSelection } from "../../../contexts/MediaSelectionContext";
import { GalleryActionBar } from "./GalleryActionBar";
import { GalleryEmpty } from "./GalleryEmpty";

type GalleryProps = {
  medias: Media[];
  error?: string;
  libraryPath?: string;
  onScan: () => void;
  onUpdate: () => void;
};

const GalleryContent = ({ medias, error, libraryPath, onScan, onUpdate }: GalleryProps) => {
  const { preferences } = useLibraryPreferences();

  const { selectedMediaIds, clearSelection } = useMediaSelection();
  const selectedMediaItems = medias.filter((m) => selectedMediaIds.has(m.id));

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <GalleryActionBar
        selectedCount={selectedMediaIds.size}
        selectedMedia={selectedMediaItems}
        onClearSelection={clearSelection}
        onUpdate={onUpdate}
      />
      <ScrollArea className="h-[calc(100%-3rem)] @container">
        <div
          className={cn(
            "grid gap-4 p-4 grid-cols-3",
            preferences.view.gridSize === "large"
              ? "@[48rem]:grid-cols-4 @[72rem]:grid-cols-6 @[128rem]:grid-cols-8"
              : "@[48rem]:grid-cols-4 @[72rem]:grid-cols-8 @[128rem]:grid-cols-12"
          )}
        >
          {medias.map((media, index) => (
            <MediaTile
              key={media.id}
              media={media}
              allMedias={medias}
              withSelection
              withPreview
              withDragAndDrop
              withDuration
              withPostsPopover
              withNavigation
              withFileName
              index={index}
            />
          ))}
          {medias.length === 0 && <GalleryEmpty libraryPath={libraryPath} onScan={onScan} />}
        </div>
      </ScrollArea>
    </div>
  );
};

export const Gallery = (props: GalleryProps) => {
  return (
    <MediaSelectionProvider media={props.medias}>
      <GalleryContent {...props} />
    </MediaSelectionProvider>
  );
};
