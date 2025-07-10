import { Link } from "react-router-dom";
import { Media } from "../../../features/library/entity";
import { useSfwMode } from "../hooks/ui/useSfwMode";
import { cn } from "../lib/utils";

type MediaViewProps = {
  media: Media;
  className?: string;
  controls?: boolean;
  linkToMediaDetail?: boolean;
};

export const MediaView = ({
  media,
  className,
  controls = false,
  linkToMediaDetail = false,
}: MediaViewProps) => {
  const { handleMouseEnter, handleMouseLeave, getBlurClassName } = useSfwMode();

  const mediaContent =
    media.type === "image" ? (
      <img
        src={`media://${media.id}`}
        alt={media.name}
        className={getBlurClassName("object-contain w-full h-full")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    ) : (
      <video
        src={`media://${media.id}`}
        controls={controls}
        className={getBlurClassName("object-contain bg-muted w-full h-full")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );

  return (
    <div className={cn("aspect-square overflow-hidden rounded-lg", className)}>
      {linkToMediaDetail ? (
        <Link
          to={`/content/${media.id}`}
          className="block w-full h-full hover:opacity-90 transition-opacity"
        >
          {mediaContent}
        </Link>
      ) : (
        mediaContent
      )}
    </div>
  );
};
