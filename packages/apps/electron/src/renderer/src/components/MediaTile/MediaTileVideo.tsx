import { useMediaSelection } from "@renderer/contexts/MediaSelectionContext";
import { Media } from "src/features/library/entity";
import { useSfwMode } from "../../hooks/ui/useSfwMode";
import { cn } from "../../lib/utils";
import { MediaTileDuration } from "./MediaTileDuration";
import { useVideoPreview } from "./useVideoPreview";

type MediaTileVideoProps = {
  media: Media;
  withPreview: boolean;
  withDuration: boolean;
  cover?: boolean;
};

export const MediaTileVideo = ({
  media,
  withPreview,
  withDuration,
  cover,
}: MediaTileVideoProps) => {
  const { currentHoveredMediaId } = useMediaSelection();
  const isPreviewActive = withPreview && currentHoveredMediaId === media.id;
  const { videoRef } = useVideoPreview({
    isActive: isPreviewActive,
    mediaType: "video",
  });
  const { handleMouseEnter, handleMouseLeave, getBlurClassName } = useSfwMode();

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {!isPreviewActive && (
        <img
          src={`thumbnail://${media.id}`}
          alt={media.name}
          className={getBlurClassName(
            cn("absolute inset-0 w-full h-full", cover ? "object-cover" : "object-contain")
          )}
          loading="lazy"
          draggable={false}
        />
      )}
      <video
        ref={videoRef}
        src={`media://${media.id}`}
        className={getBlurClassName(
          cn(
            "absolute inset-0 w-full h-full",
            cover ? "object-cover" : "object-contain",
            !isPreviewActive && "hidden"
          )
        )}
        preload="none"
        draggable={false}
      />
      {withDuration && media.duration && <MediaTileDuration duration={media.duration} />}
    </div>
  );
};
