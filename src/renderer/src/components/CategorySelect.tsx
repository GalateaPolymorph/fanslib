import { Badge } from "@renderer/components/ui/badge";
import { useCategories } from "../contexts/CategoryContext";
import { cn } from "../lib/utils";

interface CategorySelectProps {
  value?: string[];
  onChange: (categoryIds: string[]) => void;
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

  const handleToggleCategory = (id: string) => {
    if (disabledCategories.includes(id)) return;

    if (value.includes(id)) {
      onChange(value.filter((s) => s !== id));
    } else {
      if (multiple) {
        onChange([...value, id]);
      } else {
        onChange([id]);
      }
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading categories...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isDisabled = disabledCategories.includes(category.id);
        const isSelected = value.includes(category.id);

        return (
          <Badge
            key={category.id}
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
            onClick={() => handleToggleCategory(category.id)}
            title={isDisabled ? "This category already has a schedule" : undefined}
          >
            {category.name}
          </Badge>
        );
      })}
    </div>
  );
};
