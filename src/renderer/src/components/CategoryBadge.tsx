import { Badge } from "@renderer/components/ui/badge";
import { Category } from "../../../features/categories/entity";
import { cn } from "../lib/utils";

type CategoryBadgeProps = {
  category: Category;
  className?: string;
  selected?: boolean;
  selectable?: boolean;
  onClick?: () => void;
};

export const CategoryBadge = ({
  category,
  className,
  selected = false,
  selectable = false,
  onClick,
}: CategoryBadgeProps) => (
  <Badge
    variant={selected ? "default" : "outline"}
    className={cn(
      "transition-colors",
      onClick && "cursor-pointer",
      className
    )}
    style={{
      backgroundColor: (selectable && selected) || !selectable ? category.color : "transparent",
      borderColor: category.color,
      color: (selectable && selected) || !selectable ? "white" : category.color,
    }}
    onClick={onClick}
  >
    {category.name}
  </Badge>
);
