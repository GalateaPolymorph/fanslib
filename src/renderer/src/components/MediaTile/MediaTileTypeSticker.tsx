import { Sticker } from "@renderer/components/ui/sticker";
import { ImageIcon, Video } from "lucide-react";
import { Media } from "src/features/library/entity";

export const MediaTileTypeSticker = ({ media }: { media: Media }) =>
  !media.type ? null : (
    <Sticker>
      {media.type === "video" ? <Video className="size-3" /> : <ImageIcon className="size-3" />}
    </Sticker>
  );
