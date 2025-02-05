import { useState } from "react";
import { Media } from "src/features/library/entity";
import { cn } from "../../lib/utils";

type MediaTileImageProps = {
  media: Media;
  cover?: boolean;
};

export const MediaTileImage = ({ media, cover }: MediaTileImageProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <img
      src={imageError ? `media://${media.path}` : `thumbnail://${media.id}`}
      alt={media.name}
      className={cn("w-full h-full", cover ? "object-cover" : "object-contain")}
      onError={() => setImageError(true)}
      loading="lazy"
      draggable={false}
    />
  );
};
