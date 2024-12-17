import { Link } from "react-router-dom";
import { Media } from "../../../features/library/entity";
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
  const mediaContent =
    media.type === "image" ? (
      <img
        src={`media://${media.path}`}
        alt={media.name}
        className="object-contain w-full h-full"
      />
    ) : (
      <video
        src={`media://${media.path}`}
        controls={controls}
        className="object-contain bg-muted w-full h-full"
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
