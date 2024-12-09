import { Image as ImageIcon, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Media } from "../../../features/library/entity";
import { cn } from "../lib/utils";

type MediaDisplayProps = {
  media: Media;
  className?: string;
  preview?: boolean;
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const MediaDisplay = ({ media, className, preview = false }: MediaDisplayProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewIntervalRef = useRef<number>();

  useEffect(() => {
    if (!preview || !videoRef.current) return () => {};

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
  }, [isHovering, preview]);

  return (
    <div
      className={cn("relative w-full h-full", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {media.type === "video" ? (
        <video
          ref={videoRef}
          src={`media://${media.path}`}
          muted
          loop
          controls={!preview}
          playsInline
          className="absolute inset-0 w-full h-full object-contain bg-muted rounded-lg"
        />
      ) : (
        <img
          src={`media://${media.path}`}
          alt={media.name}
          className="absolute inset-0 w-full h-full object-contain bg-muted rounded-lg"
          loading="lazy"
        />
      )}
      {preview && (
        <>
          <div className="absolute top-2 left-2 bg-black/50 p-1.5 rounded-md">
            {media.type === "video" ? (
              <Video className="w-4 h-4 text-white" />
            ) : (
              <ImageIcon className="w-4 h-4 text-white" />
            )}
          </div>
          {media.type === "video" && media.duration && (
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white font-medium">
              {formatDuration(media.duration)}
            </div>
          )}
        </>
      )}
    </div>
  );
};
