import { Check, ChevronRight, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useTagDimensions } from "../../hooks/api/tags/useTagDimensions";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type TagFilterSelectorProps = {
  value?: string;
  onChange: (tagId: string) => void;
};

export const TagFilterSelector = ({ value, onChange }: TagFilterSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [expandedDimensions, setExpandedDimensions] = useState<Set<number>>(new Set());
  const [searchValue, setSearchValue] = useState("");
  const { data: dimensions = [], isLoading } = useTagDimensions();

  const categoricalDimensions = useMemo(
    () => dimensions.filter((d) => d.dataType === "categorical"),
    [dimensions]
  );

  const selectedDimension = categoricalDimensions.find((d) =>
    d.tags?.some((tag) => tag.id.toString() === value)
  );

  const selectedTag = selectedDimension?.tags?.find((tag) => tag.id.toString() === value);

  // Filter dimensions and tags based on search
  const filteredDimensionsWithTags = useMemo(() => {
    if (!searchValue.trim()) {
      return categoricalDimensions.map((dimension) => ({
        dimension,
        tags: dimension.tags || [],
        hasMatches: true,
      }));
    }

    const lowerSearch = searchValue.toLowerCase();
    return categoricalDimensions
      .map((dimension) => {
        const dimensionMatches = dimension.name.toLowerCase().includes(lowerSearch);
        const matchingTags = (dimension.tags || []).filter(
          (tag) =>
            tag.displayName.toLowerCase().includes(lowerSearch) ||
            dimension.name.toLowerCase().includes(lowerSearch)
        );

        return {
          dimension,
          tags: dimensionMatches ? dimension.tags || [] : matchingTags,
          hasMatches: dimensionMatches || matchingTags.length > 0,
        };
      })
      .filter((item) => item.hasMatches);
  }, [categoricalDimensions, searchValue]);

  // Auto-expand dimensions that have matching tags when searching
  useMemo(() => {
    if (searchValue.trim()) {
      const dimensionsWithMatches = filteredDimensionsWithTags
        .filter((item) => item.hasMatches)
        .map((item) => item.dimension.id);
      setExpandedDimensions(new Set(dimensionsWithMatches));
    }
  }, [searchValue, filteredDimensionsWithTags]);

  const toggleDimension = (dimensionId: number) => {
    if (searchValue.trim()) return; // Don't allow manual toggle during search

    const newExpanded = new Set(expandedDimensions);
    if (newExpanded.has(dimensionId)) {
      newExpanded.delete(dimensionId);
    } else {
      newExpanded.add(dimensionId);
    }
    setExpandedDimensions(newExpanded);
  };

  const handleSelectTag = (tagId: string) => {
    onChange(tagId);
    setOpen(false);
    setSearchValue("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchValue("");
      setExpandedDimensions(new Set());
    }
  };

  const getDisplayValue = () => {
    if (isLoading) return "Loading...";
    if (!selectedTag) return "Select tag...";
    return `${selectedTag.displayName}`;
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{getDisplayValue()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search tags and dimensions..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          {searchValue.trim() && <CommandEmpty>No tags found.</CommandEmpty>}
          <div className="max-h-80 overflow-y-auto">
            {filteredDimensionsWithTags.map(({ dimension, tags, hasMatches }) => {
              if (!hasMatches) return null;

              const isExpanded = expandedDimensions.has(dimension.id);
              const hasSelectedTag = tags.some((tag) => tag.id.toString() === value);

              return (
                <Collapsible
                  key={dimension.id}
                  open={isExpanded}
                  onOpenChange={() => toggleDimension(dimension.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer border-b">
                      <div className="flex items-center gap-2">
                        <span>{dimension.name}</span>
                        {hasSelectedTag && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        <span className="text-xs text-muted-foreground">
                          ({tags.length} {searchValue.trim() ? "matching " : ""}tags)
                        </span>
                      </div>
                      <ChevronRight
                        className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CommandGroup>
                      {tags
                        .sort((a, b) => a.displayName.localeCompare(b.displayName))
                        .map((tag) => (
                          <CommandItem
                            key={tag.id}
                            value={`${dimension.name} ${tag.displayName}`}
                            onSelect={() => handleSelectTag(tag.id.toString())}
                            className="pl-6"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === tag.id.toString() ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div
                              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="flex-1 truncate">{tag.displayName}</span>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
