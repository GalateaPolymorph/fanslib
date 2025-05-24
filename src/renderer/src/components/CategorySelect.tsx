import { Badge } from "@renderer/components/ui/badge";
import { useCategories } from "../hooks/api/useCategories";
import { cn } from "../lib/utils";

export type CategorySelectionState = {
  id: string;
  state: "selected" | "half-selected" | "unselected";
};

type CategorySelectProps = {
  value?: CategorySelectionState[] | undefined; // undefined means nothing selected, empty array means "None" selected
  onChange: (
    categoryStates: CategorySelectionState[] | undefined,
    changedCategoryId: string
  ) => void;
  multiple?: boolean;
  disabledCategories?: string[];
  includeNoneOption?: boolean;
};

export const CategorySelect = ({
  value,
  onChange,
  multiple = true,
  disabledCategories = [],
  includeNoneOption = false,
}: CategorySelectProps) => {
  const { data: categories = [], isLoading } = useCategories();

  const getCategoryState = (id: "NONE" | string): "selected" | "half-selected" | "unselected" => {
    if (id === "NONE") {
      return Array.isArray(value) && value.length === 0 ? "selected" : "unselected";
    }

    const categoryState = value?.find((t) => t.id === id);
    return categoryState?.state ?? "unselected";
  };

  const handleToggleCategory = (id: string) => {
    if (disabledCategories.includes(id)) return;

    const currentState = getCategoryState(id);
    const newState: CategorySelectionState["state"] =
      currentState === "unselected" || currentState === "half-selected" ? "selected" : "unselected";

    const otherCategories = value?.filter((t) => t.id !== id) ?? [];

    if (newState === "unselected") {
      if (otherCategories.length === 0) {
        if (multiple) {
          onChange(undefined, id);
          return;
        }
        onChange([], id);
        return;
      }
      onChange(otherCategories, id);
      return;
    }

    if (multiple) {
      onChange([...otherCategories, { id, state: newState }], id);
      return;
    }

    onChange([{ id, state: newState }], id);
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading categories...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isDisabled = disabledCategories.includes(category.id);
        const state = getCategoryState(category.id);

        return (
          <Badge
            key={category.id}
            variant={
              state === "selected"
                ? "default"
                : state === "half-selected"
                  ? "halfSelected"
                  : "outline"
            }
            className={cn(
              "transition-colors cursor-pointer",
              !multiple && value?.length > 0 && state === "unselected" && "opacity-50",
              isDisabled && "opacity-30 cursor-not-allowed"
            )}
            style={{
              backgroundColor: state === "selected" ? category.color : "transparent",
              borderColor: category.color,
              color: state === "selected" ? "white" : category.color,
              ...(state === "half-selected" &&
                ({
                  "--half-selected-color": category.color,
                } as React.CSSProperties)),
            }}
            onClick={() => handleToggleCategory(category.id)}
            title={isDisabled ? "This category already has a schedule" : undefined}
          >
            {category.name}
          </Badge>
        );
      })}
      {includeNoneOption && (
        <Badge
          variant={getCategoryState("NONE") === "selected" ? "default" : "outline"}
          className={cn(
            "transition-colors cursor-pointer text-muted-foreground",
            !multiple && value?.length > 0 && "opacity-50"
          )}
          onClick={() => {
            onChange(getCategoryState("NONE") === "selected" ? undefined : [], "");
          }}
          style={{
            backgroundColor:
              getCategoryState("NONE") === "selected" ? "hsl(var(--muted))" : "transparent",
            borderColor: "hsl(var(--muted))",
          }}
        >
          None
        </Badge>
      )}
    </div>
  );
};
