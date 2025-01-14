import { ImageIcon, Video } from "lucide-react";
import { Media } from "src/features/library/entity";

export const MediaTileTypeIcon = ({ media }: { media: Media }) => (
  <div className="text-background p-1 rounded bg-black/50 size-5">
    {media.type === "video" ? <Video className="size-3" /> : <ImageIcon className="size-3" />}
  </div>
);
