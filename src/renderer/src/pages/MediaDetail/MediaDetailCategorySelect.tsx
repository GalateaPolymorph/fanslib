import { useEffect, useState } from "react";
import { Media } from "../../../../features/library/entity";
import { CategorySelect } from "../../components/CategorySelect";

type Props = {
  media: Media;
};

export const MediaDetailCategorySelect = ({ media }: Props) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategories((media.categories ?? []).map((cat) => cat.id));
  }, [media]);

  const handleChangeCategory = async (newCategories: string[]) => {
    try {
      await window.api["library:update"](media.id, { categoryIds: newCategories });
      setCategories(newCategories);
    } catch (error) {
      console.error("Failed to update media category:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Categories</h3>
      <CategorySelect value={categories} onChange={handleChangeCategory} />
    </div>
  );
};
