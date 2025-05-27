import { Sticker } from "@renderer/components/ui/sticker";
import { Media } from "src/features/library/entity";
import { useMediaTags } from "../../hooks/tags/useMediaTags";
import { getCategoryTags } from "../../lib/media-tags";

type MediaTileCategoryStickerProps = {
  media: Media;
};

export const MediaTileCategorySticker = ({ media }: MediaTileCategoryStickerProps) => {
  const { data: mediaTags = [] } = useMediaTags(media.id);
  const categoryTags = getCategoryTags(mediaTags);

  if (!categoryTags.length) return null;

  return (
    <Sticker>
      {categoryTags.map((tag) => (
        <div
          key={tag.id}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: tag.color || "#666" }}
        />
      ))}
    </Sticker>
  );
};
