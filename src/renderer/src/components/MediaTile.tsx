import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Check, Image as ImageIcon, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Media } from "../../../features/library/entity";
import { cn } from "../lib/utils";
import { formatDuration } from "../lib/video";
import { ChannelBadge } from "./ChannelBadge";
import { ChannelTypeId } from "./ChannelTypeIcon";
import { Button } from "./ui/button";

type MediaDisplayProps = {
  media: Media;
  className?: string;
  isActivePreview?: boolean;
};

export const MediaTile = ({ media, className, isActivePreview = false }: MediaDisplayProps) => {
  const [imageError, setImageError] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewIntervalRef = useRef<number>();

  useEffect(() => {
    if (!videoRef.current) return () => {};

    const video = videoRef.current;

    if (isActivePreview && !popoverOpen) {
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
  }, [isActivePreview, popoverOpen]);

  // Group posts by channel and find the latest post date for each channel
  const postsByChannel = media.postMedia.reduce(
    (acc, pm) => {
      if (pm.post.status !== "posted") return acc;

      const channelId = pm.post.channel?.id;
      if (!channelId) return acc;

      if (!acc[channelId]) {
        acc[channelId] = {
          channelName: pm.post.channel?.name,
          channelTypeId: pm.post.channel?.typeId,
          count: 0,
          lastPostDate: new Date(0),
        };
      }

      acc[channelId].count++;
      const postDate = new Date(pm.post.date);
      if (postDate > acc[channelId].lastPostDate) {
        acc[channelId].lastPostDate = postDate;
      }

      return acc;
    },
    {} as Record<
      string,
      { channelName: string; channelTypeId: string; count: number; lastPostDate: Date }
    >
  );

  const mediaHasBeenPosted =
    media.postMedia.find((pm) => pm.post.status === "posted") !== undefined;
  const mediaHasBeenScheduled =
    media.postMedia.find((pm) => pm.post.status === "scheduled") !== undefined;

  return (
    <div className={cn("relative aspect-square bg-muted rounded-md overflow-hidden", className)}>
      {media.type === "video" ? (
        <>
          {!isActivePreview && (
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
            className={cn(
              "absolute inset-0 w-full h-full object-cover",
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
        <>
          <img
            src={imageError ? `media://${media.path}` : `thumbnail://${media.id}`}
            alt={media.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </>
      )}
      <div className="absolute top-1 left-1 flex gap-1 z-10">
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
        {(mediaHasBeenPosted || mediaHasBeenScheduled) && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "p-0 h-5 w-5 bg-black/50 hover:bg-black/70 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0",
                  mediaHasBeenPosted ? "text-green-400" : "text-blue-400"
                )}
                onMouseEnter={() => {
                  setPopoverOpen(true);
                }}
                onMouseLeave={() => {
                  setPopoverOpen(false);
                }}
              >
                <Check className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-2 bg-popover text-popover-foreground shadow-md rounded-md border focus-visible:ring-0 focus-visible:outline-none"
              align="start"
              sideOffset={5}
              onMouseEnter={() => setPopoverOpen(true)}
              onMouseLeave={() => setPopoverOpen(false)}
            >
              <div className="space-y-1.5">
                {Object.entries(postsByChannel).map(
                  ([channelId, { channelName, channelTypeId, count, lastPostDate }]) => (
                    <div key={channelId} className="text-xs flex items-center gap-2">
                      <ChannelBadge name={channelName} typeId={channelTypeId as ChannelTypeId} />
                      <span className="text-muted-foreground">
                        {count}× · {format(lastPostDate, "MMM d")}
                      </span>
                    </div>
                  )
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
