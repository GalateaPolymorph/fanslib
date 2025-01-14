import { useMediaSelection } from "@renderer/contexts/MediaSelectionContext";
import { Media } from "src/features/library/entity";
import { cn } from "../../lib/utils";
import { MediaTileDuration } from "./MediaTileDuration";
import { useVideoPreview } from "./useVideoPreview";

type MediaTileVideoProps = {
  media: Media;
  withPreview: boolean;
  withDuration: boolean;
};

export const MediaTileVideo = ({ media, withPreview, withDuration }: MediaTileVideoProps) => {
  const { currentHoveredMediaId } = useMediaSelection();
  const isPreviewActive = withPreview && currentHoveredMediaId === media.id;
  const { videoRef } = useVideoPreview({
    isActive: isPreviewActive,
    mediaType: "video",
  });

  return (
    <>
      {!isPreviewActive && (
        <img
          src={`thumbnail://${media.id}`}
          alt={media.name}
          className="absolute inset-0 w-full h-full object-contain"
          loading="lazy"
          draggable={false}
        />
      )}
      <video
        ref={videoRef}
        src={`media://${media.path}`}
        className={cn(
          "absolute inset-0 w-full h-full object-contain",
          !isPreviewActive && "hidden"
        )}
        preload="none"
        draggable={false}
      />
      {withDuration && media.duration && <MediaTileDuration duration={media.duration} />}
    </>
  );
};
