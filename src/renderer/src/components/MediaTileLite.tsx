import { Image as ImageIcon, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Media } from "../../../features/library/entity";
import { cn } from "../lib/utils";
import { formatDuration } from "../lib/video";

export type MediaTileLiteProps = {
  media: Media;
  className?: string;
  onImageError?: (error: boolean) => void;
  imageError?: boolean;
  isActivePreview?: boolean;
};

export const MediaTileLite = ({
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

  const handleImageError = () => {
    setLocalImageError(true);
    onImageError?.(true);
  };

  useEffect(() => {
    if (!videoRef.current || media.type !== "video") return () => {};

    const video = videoRef.current;

    if (isActivePreview) {
      video.muted = true;
      video.currentTime = 0;
      video.play();

      // Skip forward every second
      previewIntervalRef.current = window.setInterval(() => {
        if (video.currentTime < video.duration - 2) {
          video.currentTime += 2;
        } else {
          video.currentTime = 0;
        }
      }, 1000);
    } else {
      video.pause();
      video.currentTime = 0;
      if (previewIntervalRef.current) {
        clearInterval(previewIntervalRef.current);
      }
    }

    return () => {
      if (previewIntervalRef.current) {
        clearInterval(previewIntervalRef.current);
      }
    };
  }, [isActivePreview, media.type]);

  return (
    <div className={cn("relative aspect-square bg-muted rounded-md overflow-hidden", className)}>
      {media.type === "video" ? (
        <>
          {!isActivePreview && (
            <img
              src={`thumbnail://${media.id}`}
              alt={media.name}
              className="absolute inset-0 w-full h-full object-contain"
              onError={handleImageError}
            />
          )}
          <video
            ref={videoRef}
            src={`media://${media.path}`}
            className={cn(
              "absolute inset-0 w-full h-full object-contain",
              !isActivePreview && "hidden"
            )}
          />
          {media.duration && (
            <div className="absolute bottom-1 right-1 bg-black/50 px-1 py-0.5 rounded text-2xs text-white font-medium">
              {formatDuration(media.duration)}
            </div>
          )}
        </>
      ) : (
        <img
          src={imageError ? `media://${media.path}` : `thumbnail://${media.id}`}
          alt={media.name}
          className="absolute inset-0 w-full h-full object-contain"
          onError={handleImageError}
        />
      )}
      <div className="absolute bottom-1 left-1 flex gap-1 z-10">
        <div className="text-background p-1 rounded bg-black/50 size-5">
          {media.type === "video" ? (
            <Video className="w-3 h-3" />
          ) : (
            <ImageIcon className="w-3 h-3" />
          )}
        </div>
        {media.categories.length > 0 && (
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
};
