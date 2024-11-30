import { Badge } from "@renderer/components/ui/badge";
import { useCategories } from "../contexts/CategoryContext";
import { cn } from "../lib/utils";

interface CategorySelectProps {
  value?: string[];
  onChange: (categorySlugs: string[]) => void;
  multiple?: boolean;
  disabledCategories?: string[];
}

export const CategorySelect = ({
  value = [],
  onChange,
  multiple = true,
  disabledCategories = [],
}: CategorySelectProps) => {
  const { categories, isLoading } = useCategories();

  const handleToggleCategory = (slug: string) => {
    if (disabledCategories.includes(slug)) return;

    if (value.includes(slug)) {
      onChange(value.filter((s) => s !== slug));
    } else {
      if (multiple) {
        onChange([...value, slug]);
      } else {
        onChange([slug]);
      }
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading categories...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isDisabled = disabledCategories.includes(category.slug);
        const isSelected = value.includes(category.slug);

        return (
          <Badge
            key={category.slug}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "transition-colors cursor-pointer",
              !multiple && value.length > 0 && !isSelected && "opacity-50",
              isDisabled && "opacity-30 cursor-not-allowed"
            )}
            style={{
              backgroundColor: isSelected ? category.color : "transparent",
              borderColor: category.color,
              color: isSelected ? "white" : category.color,
            }}
            onClick={() => handleToggleCategory(category.slug)}
            title={isDisabled ? "This category already has a schedule" : undefined}
          >
            {category.name}
          </Badge>
        );
      })}
    </div>
  );
};
