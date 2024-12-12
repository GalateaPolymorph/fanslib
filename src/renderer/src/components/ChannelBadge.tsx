import { Badge } from "@renderer/components/ui/badge";
import { CHANNEL_TYPES } from "../../../features/channels/channelTypes";
import { cn } from "../lib/utils";
import { ChannelTypeIcon, ChannelTypeId } from "./ChannelTypeIcon";

type ChannelBadgeProps = {
  name: string;
  typeId: string;
  selected?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const ChannelBadge = ({
  name,
  typeId,
  selected = false,
  selectable = false,
  disabled = false,
  onClick,
}: ChannelBadgeProps) => {
  const channelType = CHANNEL_TYPES[typeId as ChannelTypeId];

  return (
    <Badge
      variant={selected ? "default" : "outline"}
      className={cn(
        "flex items-center gap-2",
        onClick || (selectable && "transition-colors cursor-pointer"),
        disabled && "opacity-30 cursor-not-allowed"
      )}
      style={{
        backgroundColor:
          (selectable && selected) || !selectable ? channelType.color : "transparent",
        borderColor: channelType.color,
        color: (selectable && selected) || !selectable ? "white" : channelType.color,
      }}
      onClick={!disabled ? onClick : undefined}
    >
      <ChannelTypeIcon
        typeId={typeId as ChannelTypeId}
        color={(selectable && selected) || !selectable ? "white" : channelType.color}
        className="w-4 h-4"
      />
      {name}
    </Badge>
  );
};
