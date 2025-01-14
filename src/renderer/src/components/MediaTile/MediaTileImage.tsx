import { useState } from "react";
import { Media } from "src/features/library/entity";

type MediaTileImageProps = {
  media: Media;
};

export const MediaTileImage = ({ media }: MediaTileImageProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <img
      src={imageError ? `media://${media.path}` : `thumbnail://${media.id}`}
      alt={media.name}
      className="w-full h-full object-contain"
      onError={() => setImageError(true)}
      loading="lazy"
      draggable={false}
    />
  );
};
