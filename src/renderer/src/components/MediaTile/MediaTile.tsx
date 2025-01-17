import { useMediaDrag } from "@renderer/contexts/MediaDragContext";
import { useMediaSelection } from "@renderer/contexts/MediaSelectionContext";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { MediaTileCategoryHint } from "./MediaTileCategoryHint";
import { MediaTileImage } from "./MediaTileImage";
import { MediaTilePostsPopover } from "./MediaTilePostsPopover";
import { MediaTileSelectionCircle } from "./MediaTileSelectionCircle";
import { MediaTileTypeIcon } from "./MediaTileTypeIcon";
import { MediaTileVideo } from "./MediaTileVideo";
import { MediaTileProps } from "./types";

export const MediaTile = (props: MediaTileProps) => {
  const navigate = useNavigate();
  const { media, allMedias } = props;

  const { startMediaDrag, endMediaDrag } = useMediaDrag();
  const { setCurrentHoveredMediaId, isHighlighted, selectedMediaIds, toggleMediaSelection } =
    useMediaSelection();

  const withPostsPopover = props.withPostsPopover ?? false;
  const withCategoryHint = props.withCategoryHint ?? false;
  const withPreview = props.withPreview ?? false;
  const withSelection = props.withSelection ?? false;
  const withDragAndDrop = props.withDragAndDrop ?? false;
  const withDuration = props.withDuration ?? false;
  const withTypeIcon = props.withTypeIcon ?? false;

  const activatePreview = () => {
    if (!withPreview) return;
    setCurrentHoveredMediaId(media.id);
  };

  const deactivatePreview = () => {
    if (!withPreview) return;
    setCurrentHoveredMediaId(null);
  };

  const selectOrNavigate = (e: React.MouseEvent<HTMLDivElement>) => {
    if (withSelection && selectedMediaIds.size > 0) {
      toggleMediaSelection(media.id, e);
      return;
    }

    const isSelectionCircleClicked = (e.target as HTMLElement).closest(".selection-circle");
    if (!isSelectionCircleClicked) {
      navigate(`/content/${encodeURIComponent(media.id)}`);
    }
  };

  const isSelected = selectedMediaIds.has(media.id);

  const dragAndDropProps = withDragAndDrop && {
    draggable: true,
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => {
      const selectedItems = selectedMediaIds.has(media.id)
        ? allMedias.filter((m) => selectedMediaIds.has(m.id))
        : [media];
      startMediaDrag(e, selectedItems);
    },
    onDragEnd: endMediaDrag,
  };

  return (
    <div
      className={cn(
        "relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group",
        props.className,
        isHighlighted(media.id) && "ring-2 ring-primary/50",
        isSelected && "ring-2 ring-primary/50"
      )}
      onMouseEnter={activatePreview}
      onMouseLeave={deactivatePreview}
      onClick={selectOrNavigate}
      {...dragAndDropProps}
    >
      {media.type === "video" && (
        <MediaTileVideo media={media} withPreview={withPreview} withDuration={withDuration} />
      )}
      {media.type === "image" && <MediaTileImage media={media} />}
      {withSelection && <MediaTileSelectionCircle mediaId={media.id} />}
      <div className="absolute bottom-1 left-1 flex gap-1 z-10">
        {withPostsPopover && <MediaTilePostsPopover media={media} />}
        {withCategoryHint && <MediaTileCategoryHint media={media} />}
        {withTypeIcon && <MediaTileTypeIcon media={media} />}
      </div>
    </div>
  );
};
