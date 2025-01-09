import { Badge } from "@renderer/components/ui/badge";
import { useTags } from "../contexts/TagContext";
import { cn } from "../lib/utils";

type TagSelectProps = {
  value?: number[];
  onChange: (tagIds: number[] | undefined) => void;
  multiple?: boolean;
  disabledTags?: number[];
  includeNoneOption?: boolean;
};

export const TagSelect = ({
  value = [],
  onChange,
  multiple = true,
  disabledTags = [],
  includeNoneOption = false,
}: TagSelectProps) => {
  const { tags, isLoading } = useTags();

  const handleToggleTag = (id: number) => {
    if (disabledTags.includes(id)) return;

    if (value?.includes(id)) {
      const newValue = value.filter((s) => s !== id);
      if (newValue.length === 0) {
        onChange(undefined);
        return;
      }

      onChange(newValue);
    } else {
      if (multiple) {
        onChange([...(value ?? []), id]);
      } else {
        onChange([id]);
      }
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading tags...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isDisabled = disabledTags.includes(tag.id);
        const isSelected = value?.includes(tag.id);

        return (
          <Badge
            key={tag.id}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "transition-colors cursor-pointer",
              !multiple && value.length > 0 && !isSelected && "opacity-50",
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
              onChange(undefined);
              return;
            }
            onChange([]);
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
