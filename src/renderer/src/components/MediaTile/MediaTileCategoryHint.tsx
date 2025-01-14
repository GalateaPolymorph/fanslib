import { Media } from "../../../../features/library/entity";

type MediaTileCategoryHintProps = {
  media: Media;
};

export const MediaTileCategoryHint = ({ media }: MediaTileCategoryHintProps) => {
  if (!media.categories?.length) return null;

  return (
    <div className="size-5 p-1 rounded bg-black/50 flex items-center justify-center">
      {media.categories.map((category) => (
        <div
          key={category.id}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: category.color }}
        />
      ))}
    </div>
  );
};
