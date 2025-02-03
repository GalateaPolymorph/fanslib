import { printTier } from "@renderer/lib/tier";
import { Media } from "src/features/library/entity";

type Props = {
  media: Media;
};

export const MediaTileTierHint = ({ media }: Props) => {
  if (!media.tier) return null;

  return (
    <div className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-md">
      {printTier(media.tier)}
    </div>
  );
};
