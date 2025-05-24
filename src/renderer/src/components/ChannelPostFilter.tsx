import { useChannels } from "@renderer/hooks/api/useChannels";
import { Check, X } from "lucide-react";
import type { ChannelPostFilter as ChannelPostFilterType } from "../../../features/library/api-type";
import { ChannelTypeIcon, ChannelTypeId } from "./ChannelTypeIcon";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type ChannelPostFilterProps = {
  value: ChannelPostFilterType[];
  onChange: (filters: ChannelPostFilterType[]) => void;
};

export const ChannelPostFilter = ({ value, onChange }: ChannelPostFilterProps) => {
  const { data: channels = [] } = useChannels();

  const toggleFilter = (channelId: string, toggleValue: string | null) => {
    const target = toggleValue === "true" ? true : toggleValue === "false" ? false : undefined;

    onChange([
      ...value.filter((f) => f.channelId !== channelId),
      ...(target === undefined ? [] : [{ channelId, posted: target }]),
    ]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[180px]">
          Channel
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4">
        <div className="space-y-4">
          <div className="text-sm font-medium text-muted-foreground">Posted in...</div>
          <div className="space-y-2">
            {channels.map((channel) => {
              const currentFilter = value.find((f) => f.channelId === channel.id);
              return (
                <div key={channel.id} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <ChannelTypeIcon typeId={channel.typeId as ChannelTypeId} className="w-4 h-4" />
                    <span className="text-sm font-medium truncate">{channel.name}</span>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={currentFilter ? (currentFilter.posted ? "true" : "false") : null}
                    onValueChange={(newValue) => toggleFilter(channel.id, newValue)}
                    className="flex-1"
                  >
                    <ToggleGroupItem
                      value="true"
                      className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      aria-label="Posted"
                    >
                      <Check className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="false"
                      className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      aria-label="Not posted"
                    >
                      <X className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
