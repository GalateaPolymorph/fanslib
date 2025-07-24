import { useState } from "react";
import { Media } from "src/features/library/entity";
import { useSfwMode } from "../../hooks/ui/useSfwMode";
import { cn } from "../../lib/utils";

type MediaTileImageProps = {
  media: Media;
  cover?: boolean;
};

export const MediaTileImage = ({ media, cover }: MediaTileImageProps) => {
  const [imageError, setImageError] = useState(false);
  const { handleMouseEnter, handleMouseLeave, getBlurClassName } = useSfwMode();

  return (
    <img
      src={imageError ? `media://${media.id}` : `thumbnail://${media.id}`}
      alt={media.name}
      className={getBlurClassName(cn("w-full h-full", cover ? "object-cover" : "object-contain"))}
      onError={() => setImageError(true)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      loading="lazy"
      draggable={false}
    />
  );
};
