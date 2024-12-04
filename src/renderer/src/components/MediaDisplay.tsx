import { Media } from "../../../lib/database/media/type";
import { cn } from "../lib/utils";

type MediaDisplayProps = {
  media: Media;
  className?: string;
};
export const MediaDisplay = ({ media, className }: MediaDisplayProps) => {
  if (media.type === "image") {
    return (
      <img
        src={`media://${media.path}`}
        alt={media.name}
        className={cn("w-full h-full object-cover rounded-lg overflow-hidden", className)}
      />
    );
  }

  if (media.type === "video") {
    return (
      <video
        src={`media://${media.path}`}
        className={cn("w-full h-full object-cover rounded-lg overflow-hidden", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center text-muted-foreground rounded-lg",
        className
      )}
    >
      Unsupported media type
    </div>
  );
};
