import { useChannels } from "@renderer/hooks/api/useChannels";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { ChannelBadge } from "./ChannelBadge";

type ChannelSelectProps = {
  value?: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  disabledChannels?: string[];
  selectable?: boolean;
  className?: string;
};

export const ChannelSelect = ({
  value = [],
  onChange,
  multiple = true,
  disabledChannels = [],
  selectable = true,
  className,
}: ChannelSelectProps) => {
  const { data: channels = [] } = useChannels();

  const handleToggleChannel = (channelId: string) => {
    if (disabledChannels.includes(channelId)) return;

    if (value.includes(channelId)) {
      onChange(value.filter((id) => id !== channelId));
    } else {
      if (multiple) {
        onChange([...value, channelId]);
      } else {
        onChange([channelId]);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {channels.length === 0 && (
        <>
          <div className="text-sm text-muted-foreground">No channels found.</div>
          <Link to="/channels" className="text-sm hover:underline">
            Create a channel
          </Link>
        </>
      )}

      {channels.map((channel) => {
        const isDisabled = disabledChannels.includes(channel.id);
        const isSelected = value.includes(channel.id);

        return (
          <div
            key={channel.id}
            className={cn(!multiple && value.length > 0 && !isSelected && "opacity-50", className)}
          >
            <ChannelBadge
              name={channel.name}
              typeId={channel.typeId}
              selectable={selectable}
              selected={isSelected}
              disabled={isDisabled}
              onClick={() => handleToggleChannel(channel.id)}
            />
          </div>
        );
      })}
    </div>
  );
};
