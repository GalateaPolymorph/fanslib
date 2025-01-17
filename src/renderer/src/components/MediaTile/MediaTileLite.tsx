import { Image as ImageIcon, Video } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Media } from "../../../../features/library/entity";
import { cn } from "../../lib/utils";
import { formatDuration } from "../../lib/video";

export type MediaTileLiteProps = {
  media: Media;
  className?: string;
  onImageError?: (error: boolean) => void;
  imageError?: boolean;
  isActivePreview?: boolean;
};

export const MediaTileLite = memo(
  ({
    media,
    className,
    onImageError,
    imageError: controlledImageError,
    isActivePreview = false,
  }: MediaTileLiteProps) => {
    const [localImageError, setLocalImageError] = useState(false);
    const imageError = controlledImageError ?? localImageError;
    const videoRef = useRef<HTMLVideoElement>(null);
    const previewIntervalRef = useRef<number>();

    const handleImageError = useCallback(() => {
      setLocalImageError(true);
      onImageError?.(true);
    }, [onImageError]);

    useEffect(() => {
      if (!videoRef.current || media.type !== "video" || !isActivePreview) return () => {};

      const video = videoRef.current;
      video.muted = true;
      video.currentTime = 0;

      const playVideo = async () => {
        try {
          video.play();
        } catch (error) {
          console.error("Failed to play video:", error);
        }
      };

      playVideo();

      // Skip forward every second
      previewIntervalRef.current = window.setInterval(() => {
        if (video.currentTime < video.duration - 2) {
          video.currentTime += 2;
        } else {
          video.currentTime = 0;
        }
      }, 1000);

      return () => {
        video.pause();
        video.currentTime = 0;
        if (previewIntervalRef.current) {
          clearInterval(previewIntervalRef.current);
        }
      };
    }, [isActivePreview, media.type]);

    const thumbnailUrl = `thumbnail://${media.id}`;
    const mediaUrl = `media://${media.path}`;

    return (
      <div className={cn("relative aspect-square bg-muted rounded-md overflow-hidden", className)}>
        {media.type === "video" ? (
          <>
            {!isActivePreview && (
              <img
                src={thumbnailUrl}
                alt={media.name}
                className="absolute inset-0 w-full h-full object-contain"
                onError={handleImageError}
                loading="lazy"
                draggable={false}
              />
            )}
            <video
              ref={videoRef}
              src={mediaUrl}
              className={cn(
                "absolute inset-0 w-full h-full object-contain",
                !isActivePreview && "hidden"
              )}
              preload="none"
              draggable={false}
            />
            {media.duration && (
              <div className="absolute bottom-1 right-1 bg-black/50 px-1 py-0.5 rounded text-2xs text-white font-medium">
                {formatDuration(media.duration)}
              </div>
            )}
          </>
        ) : (
          <img
            src={imageError ? mediaUrl : thumbnailUrl}
            alt={media.name}
            className="w-full h-full object-contain"
            onError={handleImageError}
            loading="lazy"
            draggable={false}
          />
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            {media.type === "video" ? (
              <Video className="w-8 h-8 text-muted-foreground" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
        )}
        <div className="absolute bottom-1 left-1 flex gap-1 z-10">
          {media.categories?.length > 0 && (
            <div className="size-5 p-1 rounded bg-black/50 flex items-center justify-center">
              {media.categories.map((category) => (
                <div
                  key={category.id}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MediaTileLite.displayName = "MediaTileLite";
