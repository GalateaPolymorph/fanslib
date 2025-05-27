import { Sticker } from "@renderer/components/ui/sticker";
import { Media } from "src/features/library/entity";
import { useMediaTags } from "../../hooks/tags/useMediaTags";
import { formatTierLevelAsDisplay, getTierLevel } from "../../lib/media-tags";

type Props = {
  media: Media;
};

export const MediaTileTierSticker = ({ media }: Props) => {
  const { data: mediaTags = [] } = useMediaTags(media.id);
  const tierLevel = getTierLevel(mediaTags);

  if (tierLevel === null) return null;

  return <Sticker className="text-xs">{formatTierLevelAsDisplay(tierLevel)}</Sticker>;
};
