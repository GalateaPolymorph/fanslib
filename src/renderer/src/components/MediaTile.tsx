import { Image as ImageIcon, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Media } from "../../../features/library/entity";
import { cn } from "../lib/utils";
import { formatDuration } from "../lib/video";

type MediaDisplayProps = {
  media: Media;
  className?: string;
};

export const MediaTile = ({ media, className }: MediaDisplayProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewIntervalRef = useRef<number>();

  useEffect(() => {
    if (!videoRef.current) return () => {};

    const video = videoRef.current;

    if (isHovering) {
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
  }, [isHovering]);

  return (
    <div
      className={cn("relative aspect-square bg-muted rounded-md overflow-hidden", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {media.type === "video" ? (
        <>
          {!isHovering && (
            <img
              src={`thumbnail://${media.id}`}
              alt={media.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
          <video
            ref={videoRef}
            src={`media://${media.path}`}
            className={cn("absolute inset-0 w-full h-full object-cover", !isHovering && "hidden")}
          />
          {media.duration && (
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white font-medium">
              {formatDuration(media.duration)}
            </div>
          )}
        </>
      ) : (
        <>
          <img
            src={imageError ? `media://${media.path}` : `thumbnail://${media.id}`}
            alt={media.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </>
      )}
      <div className={cn("absolute top-1 left-1 text-background p-1 rounded bg-black/50")}>
        {media.type === "video" ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
      </div>
    </div>
  );
};
