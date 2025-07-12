import { Plus } from "lucide-react";
import { useTagDimensions } from "../hooks/api/tags/useTagDimensions";
import { Button } from "./ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

type TagFilterDimensionSelectProps = {
  excludeDimensions?: string[];
  onDimensionSelect: (dimensionName: string) => void;
  className?: string;
};

export const TagFilterDimensionSelect = ({
  excludeDimensions = [],
  onDimensionSelect,
  className,
}: TagFilterDimensionSelectProps) => {
  const { data: dimensions = [], isLoading } = useTagDimensions();

  const availableDimensions = dimensions.filter(
    (dimension) => !excludeDimensions.includes(dimension.name)
  );

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" className={`h-9 ${className}`} disabled>
        Loading...
      </Button>
    );
  }

  if (availableDimensions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`h-9 ${className}`}>
          <Plus className="mr-2 h-4 w-4" />
          Add tag filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {availableDimensions.map((dimension) => (
          <DropdownMenuItem key={dimension.id} onClick={() => onDimensionSelect(dimension.name)}>
            {dimension.name}
            {dimension.description && (
              <span className="ml-2 text-xs text-muted-foreground">({dimension.description})</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
