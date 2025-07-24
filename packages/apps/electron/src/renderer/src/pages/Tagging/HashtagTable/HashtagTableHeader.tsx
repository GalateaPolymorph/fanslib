import { cn } from "@renderer/lib/utils";
import { CSSProperties } from "react";
import { Channel } from "src/features/channels/entity";
import { ChannelBadge } from "../../../components/ChannelBadge";

type HashtagTableHeaderProps = {
  channels: Channel[];
};

export const HashtagTableHeader = ({ channels }: HashtagTableHeaderProps) => (
  <div className={cn("grid grid-cols-[1fr_5fr_auto] border-b")}>
    <div className="p-2 pl-4 h-12 flex items-center text-muted-foreground">Hashtag</div>
    <div
      className="grid grid-cols-[repeat(var(--channel-count),_1fr)]"
      style={{ "--channel-count": channels.length } as CSSProperties}
    >
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="p-2 h-12 flex items-center justify-start text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <ChannelBadge size="sm" name={channel.name} typeId={channel.typeId} />
            <span>views</span>
          </div>
        </div>
      ))}
    </div>
    <div />
  </div>
);
