import { Media } from "../../../../../../features/library/entity";
import { CategorySelect, CategorySelectionState } from "../../../../components/CategorySelect";
import { getSelectionStates, updateSelectionForMedia } from "../../../../lib/selection-utils";

type GalleryCategorySelectProps = {
  selectedMedia: Media[];
  onUpdate: () => void;
};

export const GalleryCategorySelect = ({ selectedMedia, onUpdate }: GalleryCategorySelectProps) => {
  const getCategoryStates = (): CategorySelectionState[] => {
    const states = getSelectionStates<Media, string>(selectedMedia, selectedMedia, (media) =>
      media.categories.map((cat) => cat.id)
    );
    return states;
  };

  const handleCategoryChange = async (
    categoryStates: CategorySelectionState[] | undefined,
    changedCategoryId: string
  ) => {
    if (!categoryStates || selectedMedia.length === 0 || changedCategoryId === "") return;

    await updateSelectionForMedia(
      selectedMedia,
      changedCategoryId,
      (mediaId, categoryIds) =>
        window.api["library:update"](mediaId, {
          categoryIds: categoryIds as string[],
        }),
      (media) => media.categories.map((cat) => cat.id)
    );

    onUpdate();
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">Assign category</div>
      <CategorySelect value={getCategoryStates()} onChange={handleCategoryChange} multiple={true} />
    </div>
  );
};
