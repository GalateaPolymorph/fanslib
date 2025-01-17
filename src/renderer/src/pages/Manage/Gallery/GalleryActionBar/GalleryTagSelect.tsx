import { Media } from "../../../../../../features/library/entity";
import { TagSelect, TagSelectionState } from "../../../../components/TagSelect";
import { getSelectionStates, updateSelectionForMedia } from "../../../../lib/selection-utils";

type GalleryTagSelectProps = {
  selectedMedia: Media[];
  onUpdate: () => void;
};

export const GalleryTagSelect = ({ selectedMedia, onUpdate }: GalleryTagSelectProps) => {
  const getTagStates = (): TagSelectionState[] => {
    const states = getSelectionStates<Media, number>(selectedMedia, selectedMedia, (media) =>
      media.tags.map((tag) => tag.id)
    );
    return states;
  };

  const handleTagChange = async (
    tagStates: TagSelectionState[] | undefined,
    changedTagId: number
  ) => {
    if (!tagStates || selectedMedia.length === 0 || changedTagId === -1) return;

    await updateSelectionForMedia(
      selectedMedia,
      changedTagId,
      (mediaId, tagIds) => window.api["library:updateTags"](mediaId, tagIds as number[]),
      (media) => media.tags.map((tag) => tag.id)
    );

    onUpdate();
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">Assign tags</div>
      <TagSelect value={getTagStates()} onChange={handleTagChange} multiple={true} />
    </div>
  );
};
