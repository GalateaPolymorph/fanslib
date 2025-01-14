import { Media } from "../../../../features/library/entity";

export type MediaTileProps = {
  media: Media;
  allMedias: Media[];
  index: number;
  className?: string;

  withPostsPopover?: boolean;
  withCategoryHint?: boolean;
  withSelection?: boolean;
  withPreview?: boolean;
  withDragAndDrop?: boolean;
  withDuration?: boolean;
  withTypeIcon?: boolean;
};
