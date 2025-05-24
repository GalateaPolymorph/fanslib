import { useCategories } from "@renderer/hooks";
import { useEffect, useState } from "react";
import { Media } from "../../../../features/library/entity";
import { CategorySelect, CategorySelectionState } from "../../components/CategorySelect";

type Props = {
  media: Media;
};

export const MediaDetailCategorySelect = ({ media }: Props) => {
  const { isLoading } = useCategories();
  const [categoryStates, setCategoryStates] = useState<CategorySelectionState[]>([]);

  useEffect(() => {
    setCategoryStates(
      media.categories?.map((category) => ({
        id: category.id,
        state: "selected" as const,
      })) ?? []
    );
  }, [media.categories]);

  const updateCategories = async (newCategoryStates: CategorySelectionState[] | undefined) => {
    const categoryIds =
      newCategoryStates?.filter((c) => c.state === "selected").map((c) => c.id) ?? [];

    try {
      await window.api["library:update"](media.id, { categoryIds });
      setCategoryStates(newCategoryStates ?? []);
    } catch (error) {
      console.error("Failed to update categories:", error);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading categories...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Categories</h3>
      <CategorySelect
        value={categoryStates}
        onChange={updateCategories}
        multiple
        includeNoneOption
      />
    </div>
  );
};
