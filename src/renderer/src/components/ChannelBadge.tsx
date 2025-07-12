import { Badge, BadgeProps } from "@renderer/components/ui/Badge";
import { CHANNEL_TYPES } from "../../../features/channels/channelTypes";
import { cn } from "../lib/utils";
import { ChannelTypeIcon, ChannelTypeId } from "./ChannelTypeIcon";

type ChannelBadgeProps = {
  name: string;
  noName?: boolean;
  typeId: string;
  size?: BadgeProps["size"];
  selected?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export const ChannelBadge = ({
  name,
  typeId,
  size = "default",
  selected = false,
  selectable = false,
  disabled = false,
  onClick,
  className,
}: ChannelBadgeProps) => {
  const channelType = CHANNEL_TYPES[typeId as ChannelTypeId];

  return (
    <Badge
      variant={selected ? "default" : "outline"}
      shape={name === "" ? "iconOnly" : "default"}
      size={size}
      className={cn(
        "flex items-center cursor-pointer",
        {
          "gap-2": size === "default",
          "gap-1": size === "sm",
          "gap-3": size === "lg",
        },
        onClick || (selectable && "transition-colors cursor-pointer"),
        disabled && "opacity-30 cursor-not-allowed",
        className
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
        className={cn("w-4 h-4", size === "sm" && "w-3 h-3")}
      />
      {name}
    </Badge>
  );
};
