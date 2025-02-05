import { useLibrary } from "@renderer/contexts/LibraryContext";
import { useEffect, useState } from "react";
import { Media } from "../../../../features/library/entity";
import { CategorySelect, CategorySelectionState } from "../../components/CategorySelect";

type Props = {
  media: Media;
};

export const MediaDetailCategorySelect = ({ media }: Props) => {
  const { refetch } = useLibrary();
  const [categoryStates, setCategoryStates] = useState<CategorySelectionState[]>([]);

  useEffect(() => {
    setCategoryStates(
      (media.categories ?? []).map((cat) => ({
        id: cat.id,
        state: "selected" as const,
      }))
    );
  }, [media]);

  const handleChangeCategory = async (
    newCategoryStates: CategorySelectionState[] | undefined,
    _changedCategoryId: string
  ) => {
    try {
      const selectedCategoryIds = (newCategoryStates ?? [])
        .filter((c) => c.state === "selected")
        .map((c) => c.id);

      await window.api["library:update"](media.id, { categoryIds: selectedCategoryIds });
      setCategoryStates(
        selectedCategoryIds.map((id) => ({
          id,
          state: "selected" as const,
        }))
      );
      refetch();
    } catch (error) {
      console.error("Failed to update media category:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Categories</h3>
      <CategorySelect value={categoryStates} onChange={handleChangeCategory} />
    </div>
  );
};
