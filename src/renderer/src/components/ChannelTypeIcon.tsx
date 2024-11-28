import {
  BlueSkyIcon,
  FanslyIcon,
  InstagramIcon,
  ManyVidsIcon,
  OnlyFansIcon,
  RedditIcon,
  XIcon,
} from "@renderer/components/icons";
import { CHANNEL_TYPES } from "../../../lib/database/channels/channelTypes";
import { cn } from "../lib/utils";

const CHANNEL_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  onlyfans: OnlyFansIcon,
  fansly: FanslyIcon,
  manyvids: ManyVidsIcon,
  instagram: InstagramIcon,
  bluesky: BlueSkyIcon,
  x: XIcon,
  reddit: RedditIcon,
};

interface ChannelTypeIconProps {
  typeId: keyof typeof CHANNEL_TYPES;
  color?: string;
  className?: string;
}

export const ChannelTypeIcon = ({ typeId, color, className }: ChannelTypeIconProps) => {
  const channelType = CHANNEL_TYPES[typeId];
  const Icon = CHANNEL_ICONS[channelType.id];

  return (
    <div className={cn("w-8 h-8", className)} style={{ color: color ?? channelType.color }}>
      <Icon className="w-full h-full" />
    </div>
  );
};
