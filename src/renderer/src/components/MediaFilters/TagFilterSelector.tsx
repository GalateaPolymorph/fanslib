import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useTagDimensions } from "../../hooks/api/tags/useTagDimensions";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type TagFilterSelectorProps = {
  value?: string;
  onChange: (tagId: string) => void;
};

export const TagFilterSelector = ({ value, onChange }: TagFilterSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: dimensions = [], isLoading } = useTagDimensions();

  const categoricalDimensions = useMemo(
    () => dimensions.filter((d) => d.dataType === "categorical"),
    [dimensions]
  );

  const selectedDimension = categoricalDimensions.find((d) =>
    d.tags?.some((tag) => tag.id.toString() === value)
  );

  const selectedTag = selectedDimension?.tags?.find((tag) => tag.id.toString() === value);

  const allTags = useMemo(() => {
    return categoricalDimensions
      .flatMap((dimension) =>
        (dimension.tags || []).map((tag) => ({
          ...tag,
          dimensionName: dimension.name,
        }))
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [categoricalDimensions]);

  const handleSelectTag = (tagId: string) => {
    onChange(tagId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {isLoading ? "Loading..." : selectedTag ? selectedTag.displayName : "Select tag..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandEmpty>No tag found.</CommandEmpty>
          <CommandGroup>
            {allTags.map((tag) => (
              <CommandItem
                key={tag.id}
                value={tag.displayName}
                onSelect={() => handleSelectTag(tag.id.toString())}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-1">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === tag.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.displayName}
                </div>
                <div className="text-sm text-muted-foreground">{tag.dimensionName}</div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
