import { Badge } from "@renderer/components/ui/badge";
import { Slider } from "@renderer/components/ui/slider";
import { Switch } from "@renderer/components/ui/switch";
import { useMemo } from "react";
import { useTagsByDimension } from "../hooks/tags/useTagDefinitions";
import { useTagDimensions } from "../hooks/tags/useTagDimensions";
import { cn } from "../lib/utils";

export type TagSelectionState = {
  id: string | number;
  state: "selected" | "half-selected" | "unselected";
};

type TagSelectorProps = {
  dimensionName: string;
  value?: TagSelectionState[] | undefined; // undefined means nothing selected, empty array means "None" selected
  onChange: (tagStates: TagSelectionState[] | undefined, changedTagId: string | number) => void;
  multiple?: boolean;
  disabledTags?: (string | number)[];
  includeNoneOption?: boolean;
  className?: string;
};

export const TagSelector = ({
  dimensionName,
  value,
  onChange,
  multiple = true,
  disabledTags = [],
  includeNoneOption = false,
  className,
}: TagSelectorProps) => {
  const { data: dimensions = [], isLoading: dimensionsLoading } = useTagDimensions();

  const dimension = useMemo(
    () => dimensions.find((d) => d.name === dimensionName),
    [dimensions, dimensionName]
  );

  const { data: tags = [], isLoading: tagsLoading } = useTagsByDimension(dimension?.id || 0);

  const isLoading = dimensionsLoading || tagsLoading;

  const getTagState = (
    id: "NONE" | string | number
  ): "selected" | "half-selected" | "unselected" => {
    if (id === "NONE") {
      return Array.isArray(value) && value.length === 0 ? "selected" : "unselected";
    }

    const tagState = value?.find((t) => t.id === id);
    return tagState?.state ?? "unselected";
  };

  const handleToggleTag = (id: string | number) => {
    if (disabledTags.includes(id)) return;

    const currentState = getTagState(id);
    const newState: TagSelectionState["state"] =
      currentState === "unselected" || currentState === "half-selected" ? "selected" : "unselected";

    const otherTags = value?.filter((t) => t.id !== id) ?? [];

    if (newState === "unselected") {
      if (otherTags.length === 0) {
        if (multiple) {
          onChange(undefined, id);
          return;
        }
        onChange([], id);
        return;
      }
      onChange(otherTags, id);
      return;
    }

    if (multiple) {
      onChange([...otherTags, { id, state: newState }], id);
      return;
    }

    onChange([{ id, state: newState }], id);
  };

  const handleNumericalChange = (newValue: number[]) => {
    if (!dimension) return;

    const numericValue = newValue[0];
    const existingTag = value?.find((t) => typeof t.id === "number");

    if (existingTag) {
      // Update existing numerical tag
      const otherTags = value?.filter((t) => t.id !== existingTag.id) ?? [];
      onChange([...otherTags, { id: numericValue, state: "selected" }], numericValue);
    } else {
      // Add new numerical tag
      onChange([{ id: numericValue, state: "selected" }], numericValue);
    }
  };

  const handleBooleanChange = (checked: boolean) => {
    if (!dimension) return;

    const booleanValue = checked ? 1 : 0; // Use 1/0 for boolean values
    const existingTag = value?.find((t) => typeof t.id === "number");

    if (existingTag) {
      if (!checked) {
        // Remove boolean tag when unchecked
        const otherTags = value?.filter((t) => t.id !== existingTag.id) ?? [];
        onChange(otherTags.length > 0 ? otherTags : undefined, booleanValue);
      } else {
        // Update existing boolean tag
        const otherTags = value?.filter((t) => t.id !== existingTag.id) ?? [];
        onChange([...otherTags, { id: booleanValue, state: "selected" }], booleanValue);
      }
    } else if (checked) {
      // Add new boolean tag when checked
      onChange([{ id: booleanValue, state: "selected" }], booleanValue);
    }
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading {dimensionName.toLowerCase()}...</div>
    );
  }

  if (!dimension) {
    return (
      <div className="text-sm text-destructive">
        Dimension &quot;{dimensionName}&quot; not found
      </div>
    );
  }

  // Render based on dimension data type
  if (dimension.dataType === "categorical") {
    // Sort tags by sortOrder, then by displayName
    const sortedTags = [...tags].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.displayName.localeCompare(b.displayName);
    });

    // Default categorical rendering for other dimensions
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {sortedTags.map((tag) => {
          const isDisabled = disabledTags.includes(tag.id);
          const state = getTagState(tag.id);

          return (
            <Badge
              key={tag.id}
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
                backgroundColor: state === "selected" ? tag.color : "transparent",
                borderColor: tag.color,
                color: state === "selected" ? "white" : tag.color,
                ...(state === "half-selected" &&
                  ({
                    "--half-selected-color": tag.color,
                  } as React.CSSProperties)),
              }}
              onClick={() => handleToggleTag(tag.id)}
              title={
                isDisabled
                  ? `This ${dimensionName.toLowerCase()} already has a schedule`
                  : undefined
              }
            >
              {tag.displayName}
            </Badge>
          );
        })}
        {includeNoneOption && (
          <Badge
            variant={getTagState("NONE") === "selected" ? "default" : "outline"}
            className={cn(
              "transition-colors cursor-pointer text-muted-foreground",
              !multiple && value?.length > 0 && "opacity-50"
            )}
            onClick={() => {
              onChange(getTagState("NONE") === "selected" ? undefined : [], "");
            }}
            style={{
              backgroundColor:
                getTagState("NONE") === "selected" ? "hsl(var(--muted))" : "transparent",
              borderColor: "hsl(var(--muted))",
            }}
          >
            None
          </Badge>
        )}
      </div>
    );
  }

  if (dimension.dataType === "numerical") {
    // Parse validation schema for min/max/step
    let min = 0;
    let max = 10;
    let step = 1;

    if (dimension.validationSchema) {
      try {
        const schema = JSON.parse(dimension.validationSchema);
        min = schema.minimum ?? 0;
        max = schema.maximum ?? 10;
        step = schema.step ?? 1;
      } catch (e) {
        console.warn("Failed to parse validation schema for numerical dimension:", e);
      }
    }

    const currentValue = (value?.find((t) => typeof t.id === "number")?.id as number) ?? min;

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{dimension.name}</label>
          <span className="text-sm text-muted-foreground">{currentValue}</span>
        </div>
        <Slider
          value={[currentValue]}
          onValueChange={handleNumericalChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }

  if (dimension.dataType === "boolean") {
    const isChecked = value?.some((t) => typeof t.id === "number" && t.id === 1) ?? false;

    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Switch checked={isChecked} onCheckedChange={handleBooleanChange} />
        <label className="text-sm font-medium">{dimension.name}</label>
      </div>
    );
  }

  return (
    <div className="text-sm text-destructive">Unsupported dimension type: {dimension.dataType}</div>
  );
};
