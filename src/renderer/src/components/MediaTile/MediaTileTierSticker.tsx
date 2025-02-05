import { Sticker } from "@renderer/components/ui/sticker";
import { printTier } from "@renderer/lib/tier";
import { Media } from "src/features/library/entity";

type Props = {
  media: Media;
};

export const MediaTileTierSticker = ({ media }: Props) =>
  !media.tier ? null : <Sticker className="text-xs">{printTier(media.tier)}</Sticker>;
