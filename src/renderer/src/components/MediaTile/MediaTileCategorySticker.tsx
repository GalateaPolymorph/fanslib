import { Sticker } from "@renderer/components/ui/sticker";
import { Media } from "src/features/library/entity";

type MediaTileCategoryStickerProps = {
  media: Media;
};

export const MediaTileCategorySticker = ({ media }: MediaTileCategoryStickerProps) =>
  !media.categories?.length ? null : (
    <Sticker>
      {media.categories.map((category) => (
        <div
          key={category.id}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: category.color }}
        />
      ))}
    </Sticker>
  );
