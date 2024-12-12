import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { ChannelBadge } from "./ChannelBadge";

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

        return (
          <div
            key={channel.id}
            className={cn(!multiple && value.length > 0 && !isSelected && "opacity-50")}
          >
            <ChannelBadge
              name={channel.name}
              typeId={channel.typeId}
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
