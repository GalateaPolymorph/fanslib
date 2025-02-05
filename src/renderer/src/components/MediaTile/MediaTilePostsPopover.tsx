import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { ChannelBadge } from "../ChannelBadge";
import { ChannelTypeId } from "../ChannelTypeIcon";
import { StatusSticker } from "../StatusSticker";
import { MediaTileProps } from "./types";

type PostsByChannel = Record<
  string,
  { channelName: string; channelTypeId: string; count: number; lastPostDate: Date }
>;

type PostsPopoverProps = {
  media: MediaTileProps["media"];
};

export const MediaTilePostsPopover = ({ media }: PostsPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { postsByChannel, mediaHasBeenPosted, mediaHasBeenScheduled } = useMemo(() => {
    const postsByChannel = media.postMedia.reduce((acc, pm) => {
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
      media.postMedia.find((pm) => pm.post?.status === "posted") !== undefined;

    const mediaHasBeenScheduled =
      media.postMedia.find((pm) => pm.post?.status === "scheduled") !== undefined;

    return { postsByChannel, mediaHasBeenPosted, mediaHasBeenScheduled };
  }, [media.postMedia]);

  const handlePopoverOpen = () => setPopoverOpen(true);
  const handlePopoverClose = () => setPopoverOpen(false);

  if (!mediaHasBeenPosted && !mediaHasBeenScheduled) {
    return null;
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
          <StatusSticker status={mediaHasBeenPosted ? "posted" : "scheduled"} className="w-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        align="start"
        sideOffset={5}
        className="z-50 p-2 bg-popover text-popover-foreground shadow-lg rounded-md border outline-none"
        avoidCollisions={true}
        collisionPadding={20}
        sticky="always"
      >
        <div className="space-y-1.5">
          {Object.entries(postsByChannel).map(
            ([channelId, { channelName, channelTypeId, count, lastPostDate }]) => (
              <div key={channelId} className="text-xs flex items-center gap-2">
                <ChannelBadge
                  size="sm"
                  name={channelName}
                  typeId={channelTypeId as ChannelTypeId}
                />
                <span className="text-muted-foreground">
                  {count}× · {format(lastPostDate, "MMM d")}
                </span>
              </div>
            )
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
