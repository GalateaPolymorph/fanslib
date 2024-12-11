import { Badge } from "@renderer/components/ui/badge";
import { useEffect, useState } from "react";
import { CHANNEL_TYPES } from "../../../features/channels/channelTypes";
import { cn } from "../lib/utils";
import { ChannelTypeIcon, ChannelTypeId } from "./ChannelTypeIcon";

interface ChannelSelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  disabledChannels?: string[];
}

export const ChannelSelect = ({
  value = [],
  onChange,
  multiple = true,
  disabledChannels = [],
}: ChannelSelectProps) => {
  const [channels, setChannels] = useState<Array<{ id: string; name: string; typeId: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const allChannels = await window.api["channel:getAll"]();
        setChannels(allChannels);
      } catch (error) {
        console.error("Failed to load channels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChannels();
  }, []);

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

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading channels...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {channels.length === 0 && (
        <>
          <div className="text-sm text-muted-foreground">No channels found.</div>
          <a href="/channels" className="text-sm hover:underline">
            Create a channel
          </a>
        </>
      )}

      {channels.map((channel) => {
        const isDisabled = disabledChannels.includes(channel.id);
        const isSelected = value.includes(channel.id);
        const channelType = CHANNEL_TYPES[channel.typeId];

        return (
          <Badge
            key={channel.id}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "transition-colors cursor-pointer flex items-center gap-2",
              !multiple && value.length > 0 && !isSelected && "opacity-50",
              isDisabled && "opacity-30 cursor-not-allowed"
            )}
            style={{
              backgroundColor: isSelected ? channelType.color : "transparent",
              borderColor: channelType.color,
              color: isSelected ? "white" : channelType.color,
            }}
            onClick={() => handleToggleChannel(channel.id)}
            title={isDisabled ? "This channel is not available" : undefined}
          >
            <ChannelTypeIcon
              typeId={channel.typeId as ChannelTypeId}
              color={isSelected ? "white" : channelType.color}
              className={cn("w-4 h-4")}
            />
            {channel.name}
          </Badge>
        );
      })}
    </div>
  );
};
