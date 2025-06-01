import { useChannels } from "@renderer/hooks/api/useChannels";
import { cn } from "@renderer/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { CHANNEL_TYPES } from "../../../../features/channels/channelTypes";
import { ChannelTypeIcon, ChannelTypeId } from "../ChannelTypeIcon";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type ChannelFilterSelectorProps = {
  value?: string;
  onChange: (channelId: string) => void;
};

export const ChannelFilterSelector = ({ value, onChange }: ChannelFilterSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: channels = [], isLoading } = useChannels();

  const selectedChannel = useMemo(
    () => channels.find((channel) => channel.id === value),
    [channels, value]
  );

  const displayValue = selectedChannel ? selectedChannel.name : "Select channel...";

  const selectChannel = (channelId: string) => {
    onChange(channelId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {selectedChannel && (
              <ChannelTypeIcon
                typeId={selectedChannel.typeId as ChannelTypeId}
                className="w-4 h-4"
              />
            )}
            {isLoading ? "Loading..." : displayValue}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search channels..." />
          <CommandEmpty>No channel found.</CommandEmpty>
          <CommandGroup>
            {channels.map((channel) => {
              const channelType = CHANNEL_TYPES[channel.typeId as ChannelTypeId];
              return (
                <CommandItem
                  key={channel.id}
                  value={channel.name}
                  onSelect={() => selectChannel(channel.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === channel.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <ChannelTypeIcon typeId={channel.typeId as ChannelTypeId} className="w-4 h-4" />
                    {channel.name}
                  </div>
                  <div
                    className="text-sm text-muted-foreground"
                    style={{ color: channelType.color }}
                  >
                    {channelType.name}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
