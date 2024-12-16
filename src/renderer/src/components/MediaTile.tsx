import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { ChannelBadge } from "./ChannelBadge";
import { ChannelTypeId } from "./ChannelTypeIcon";
import { MediaTileLite, MediaTileLiteProps } from "./MediaTileLite";
import { Button } from "./ui/button";

type MediaTileProps = MediaTileLiteProps;

export const MediaTile = (props: MediaTileProps) => {
  const [imageError, setImageError] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Group posts by channel and find the latest post date for each channel
  const postsByChannel = props.media.postMedia.reduce(
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
    props.media.postMedia.find((pm) => pm.post.status === "posted") !== undefined;
  const mediaHasBeenScheduled =
    props.media.postMedia.find((pm) => pm.post.status === "scheduled") !== undefined;

  return (
    <div className="relative">
      <MediaTileLite {...props} imageError={imageError} onImageError={setImageError} />
      {(mediaHasBeenPosted || mediaHasBeenScheduled) && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "p-0 h-5 w-5 bg-black/50 hover:bg-black/70 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 absolute top-1 right-1 z-20",
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
  );
};
