import { memo, useCallback, useState } from "react";
import { Media } from "../../../features/library/entity";
import { useSfwMode } from "../hooks/ui/useSfwMode";
import { cn } from "../lib/utils";

export type MediaPreviewProps = {
  media: Media;
  className?: string;
  onImageError?: (error: boolean) => void;
  imageError?: boolean;
};

export const MediaPreview = memo(
  ({ media, className, onImageError, imageError: controlledImageError }: MediaPreviewProps) => {
    const [localImageError, setLocalImageError] = useState(false);
    const imageError = controlledImageError ?? localImageError;
    const { handleMouseEnter, handleMouseLeave, getBlurClassName } = useSfwMode();

    const handleImageError = useCallback(() => {
      setLocalImageError(true);
      onImageError?.(true);
    }, [onImageError]);

    const thumbnailUrl = `thumbnail://${media.id}`;
    const mediaUrl = `media://${media.id}`;

    return (
      <div
        className={cn("relative aspect-square bg-muted rounded-md overflow-hidden", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={imageError ? mediaUrl : thumbnailUrl}
          alt={media.name}
          className={getBlurClassName("w-full h-full object-contain")}
          onError={handleImageError}
          loading="lazy"
          draggable={false}
        />
      </div>
    );
  }
);

MediaPreview.displayName = "MediaPreview";
