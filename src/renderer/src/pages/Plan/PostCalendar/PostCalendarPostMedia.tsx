import { MediaTile } from "@renderer/components/MediaTile";
import { cn } from "@renderer/lib/utils";
import { PostMedia } from "../../../../../features/posts/entity";
import { VirtualPostMedia } from "../../../lib/virtual-posts";

type PostCalendarPostMediaProps = {
  postMedia: PostMedia[] | VirtualPostMedia[];
  isVirtual: boolean;
};

export const PostCalendarPostMedia = ({ postMedia, isVirtual }: PostCalendarPostMediaProps) => {
  const allMedias = isVirtual ? [] : postMedia.map((pm) => pm.media);

  return (
    <div
      className={cn("grid gap-1 aspect-square", {
        "grid-rows-1 grid-cols-1": postMedia.length === 1,
        "grid-rows-2 grid-cols-2": postMedia.length > 1,
      })}
    >
      {Array.from({ length: postMedia.length > 1 ? 4 : 1 }).map((_, i) => {
        const media = !isVirtual ? (postMedia as PostMedia[])[i]?.media : null;

        return (
          <div className="relative bg-muted/50 rounded-md" key={i}>
            {media && (
              <MediaTile
                media={media}
                allMedias={allMedias}
                index={i}
                className="rounded-md"
                withDuration
                withPreview
              />
            )}
            {!media && <div className="w-full h-full"></div>}
            {i === 3 && postMedia.length > 4 && (
              <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                + {postMedia.length - 4}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
