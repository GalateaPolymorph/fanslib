import { Badge } from "@renderer/components/ui/badge";
import { useTags } from "../contexts/TagContext";
import { cn } from "../lib/utils";

export type TagSelectionState = {
  id: number;
  state: "selected" | "half-selected" | "unselected";
};

type TagSelectProps = {
  value?: TagSelectionState[];
  onChange: (tagStates: TagSelectionState[] | undefined, changedTagId: number) => void;
  multiple?: boolean;
  disabledTags?: number[];
  includeNoneOption?: boolean;
  size?: "default" | "sm" | "lg";
};

export const TagSelect = ({
  value = [],
  onChange,
  multiple = true,
  disabledTags = [],
  includeNoneOption = false,
  size = "default",
}: TagSelectProps) => {
  const { tags, isLoading } = useTags();

  const getTagState = (id: number): "selected" | "half-selected" | "unselected" => {
    const tagState = value.find((t) => t.id === id);
    return tagState?.state ?? "unselected";
  };

  const handleToggleTag = (id: number) => {
    if (disabledTags.includes(id)) return;

    const currentState = getTagState(id);
    const newState: TagSelectionState["state"] =
      currentState === "unselected" || currentState === "half-selected" ? "selected" : "unselected";

    const otherTags = value.filter((t) => t.id !== id);

    if (newState === "unselected") {
      if (otherTags.length === 0) {
        if (multiple) {
          onChange([{ id, state: "unselected" }], id);
          return;
        }
        onChange(undefined, id);
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

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading tags...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isDisabled = disabledTags.includes(tag.id);
        const state = getTagState(tag.id);

        return (
          <Badge
            key={tag.id}
            size={size}
            shape="tag"
            variant={
              state === "selected"
                ? "default"
                : state === "half-selected"
                  ? "halfSelected"
                  : "outline"
            }
            className={cn(
              "transition-colors cursor-pointer",
              !multiple && value.length > 0 && state === "unselected" && "opacity-50",
              isDisabled && "opacity-30 cursor-not-allowed"
            )}
            onClick={() => handleToggleTag(tag.id)}
          >
            {tag.name}
          </Badge>
        );
      })}
      {includeNoneOption && (
        <Badge
          variant={value?.length === 0 ? "default" : "outline"}
          className={cn(
            "transition-colors cursor-pointer text-muted-foreground",
            !multiple && value?.length > 0 && "opacity-50"
          )}
          onClick={() => {
            if (Array.isArray(value)) {
              onChange(undefined, -1);
              return;
            }
            onChange([], -1);
          }}
          style={{
            backgroundColor: value?.length === 0 ? "hsl(var(--muted))" : "transparent",
            borderColor: "hsl(var(--muted))",
          }}
        >
          None
        </Badge>
      )}
    </div>
  );
};
