import { MediaTile } from "@renderer/components/MediaTile";
import { Media } from "../../../../../features/library/entity";

type SubredditMediaSelectedViewProps = {
  media: Media;
};

export const SubredditMediaSelectedView = ({ media }: SubredditMediaSelectedViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-32 h-32">
          <MediaTile media={media} allMedias={[media]} index={0} />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-medium">Selected Media</h3>
          <p className="text-sm text-muted-foreground">{media.path}</p>
        </div>
      </div>
    </div>
  );
};
