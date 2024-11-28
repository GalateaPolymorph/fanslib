import { Media } from "../../../features/library/shared/types";

type MediaDisplayProps = {
  media: Media;
};
export const MediaDisplay = ({ media }: MediaDisplayProps) => {
  if (media.type === "image") {
    return (
      <img
        src={`media://${media.path}`}
        alt={media.name}
        className="w-full h-full object-cover rounded-lg overflow-hidden"
      />
    );
  }

  if (media.type === "video") {
    return (
      <video
        src={`media://${media.path}`}
        className="w-full h-full object-cover rounded-lg overflow-hidden"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-muted-foreground rounded-lg">
      Unsupported media type
    </div>
  );
};
