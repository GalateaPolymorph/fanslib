import { Media } from "../../../../features/library/entity";

export type MediaTileProps = {
  media: Media;
  allMedias: Media[];
  index: number;
  className?: string;

  withPostsPopover?: boolean;
  withSelection?: boolean;
  withNavigation?: boolean;
  withDragAndDrop?: boolean;
  withPreview?: boolean;

  withDuration?: boolean;
  withTypeIcon?: boolean;
  withTier?: boolean;
  withCategoryHint?: boolean;
  withFileName?: boolean;

  cover?: boolean;
};
