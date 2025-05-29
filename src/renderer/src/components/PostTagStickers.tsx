import { groupBy } from "ramda";
import { memo, useMemo } from "react";
import { PostMedia } from "../../../features/posts/entity";
import { useTagsForMedias } from "../hooks/api/tags/useTags";
import { Sticker } from "./ui/sticker";

type PostTagStickersProps = {
  postMedia: PostMedia[];
};

export const PostTagStickers = memo(({ postMedia }: PostTagStickersProps) => {
  const mediaIds = useMemo(() => postMedia.map((pm) => pm.media.id), [postMedia]);
  const { data: allMediaTags = [] } = useTagsForMedias(mediaIds);

  const aggregatedTags = useMemo(() => {
    if (!allMediaTags.length) return [];

    // Group tags by tagDefinitionId to deduplicate across multiple media
    const tagGroups = groupBy((mediaTag) => mediaTag.tagDefinitionId.toString(), allMediaTags);

    // Take the first occurrence of each unique tag
    return Object.values(tagGroups).map((group) => group[0]);
  }, [allMediaTags]);

  const stickerTags = useMemo(
    () => aggregatedTags.filter((tag) => tag.stickerDisplay && tag.stickerDisplay !== "none"),
    [aggregatedTags]
  );

  if (!stickerTags.length) return null;

  // Group tags by display mode for better rendering
  const colorTags = stickerTags.filter((tag) => tag.stickerDisplay === "color");
  const shortTags = stickerTags.filter((tag) => tag.stickerDisplay === "short");

  return (
    <>
      {/* Render color bubble stickers */}
      {colorTags.length > 0 && (
        <Sticker>
          {colorTags.map((tag) => (
            <div
              key={tag.id}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: tag.color || "#666" }}
            />
          ))}
        </Sticker>
      )}

      {/* Render short text stickers */}
      {shortTags.map((tag) => {
        const displayText = tag.shortRepresentation || tag.tagDisplayName || tag.tagValue;

        return (
          <Sticker key={tag.id} className="text-xs">
            {displayText}
          </Sticker>
        );
      })}
    </>
  );
});

PostTagStickers.displayName = "PostTagStickers";
