import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "../lib/utils";
import { ChannelBadge } from "./ChannelBadge";
import { ChannelTypeId } from "./ChannelTypeIcon";
import { MediaTileLite, MediaTileLiteProps } from "./MediaTileLite";
import { Button } from "./ui/button";

type MediaTileProps = MediaTileLiteProps;

type PostsByChannel = Record<
  string,
  { channelName: string; channelTypeId: string; count: number; lastPostDate: Date }
>;

export const MediaTile = (props: MediaTileProps) => {
  const [imageError, setImageError] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { postsByChannel, mediaHasBeenPosted, mediaHasBeenScheduled } = useMemo(() => {
    const postsByChannel = props.media.postMedia.reduce((acc, pm) => {
      if (pm.post?.status !== "posted") return acc;

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
    }, {} as PostsByChannel);

    const mediaHasBeenPosted =
      props.media.postMedia.find((pm) => pm.post?.status === "posted") !== undefined;
    const mediaHasBeenScheduled =
      props.media.postMedia.find((pm) => pm.post?.status === "scheduled") !== undefined;

    return { postsByChannel, mediaHasBeenPosted, mediaHasBeenScheduled };
  }, [props.media.postMedia]);

  const handlePopoverOpen = () => setPopoverOpen(true);
  const handlePopoverClose = () => setPopoverOpen(false);

  if (!mediaHasBeenPosted && !mediaHasBeenScheduled) {
    return <MediaTileLite {...props} imageError={imageError} onImageError={setImageError} />;
  }

  return (
    <div className="relative">
      <MediaTileLite {...props} imageError={imageError} onImageError={setImageError} />
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "p-0 h-5 w-5 bg-black/50 hover:bg-black/70 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 absolute bottom-1 right-1 z-20",
              mediaHasBeenPosted ? "text-green-400" : "text-blue-400"
            )}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Check className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          align="start"
          sideOffset={5}
          className="z-50 w-[200px] p-2 bg-popover text-popover-foreground shadow-lg rounded-md border outline-none"
          avoidCollisions={true}
          collisionPadding={20}
          sticky="always"
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
    </div>
  );
};
