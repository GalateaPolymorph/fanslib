import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { TagDefinition } from "../../../../../../../features/tags/entity";
import { Button } from "../../../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { cn } from "../../../../../lib/utils";
import { HierarchicalTagList, TagHierarchyItem } from "./HierarchicalTagList";
import { TagSearchInput } from "./TagSearchInput";

type ParentTagSelectorProps = {
  tags: TagDefinition[];
  selectedParentId?: number | null;
  currentTagId?: number; // To prevent selecting self as parent
  onSelectParent: (parentId: number | null) => void;
  placeholder?: string;
};

const buildHierarchicalList = (
  tags: TagDefinition[],
  excludeTagId?: number
): TagHierarchyItem[] => {
  const tagMap = new Map<number, TagDefinition>();
  tags.forEach((tag) => tagMap.set(tag.id, tag));

  const getPath = (tagId: number): string[] => {
    const tag = tagMap.get(tagId);
    if (!tag) return [];

    if (tag.parentTagId) {
      return [...getPath(tag.parentTagId), tag.displayName];
    }
    return [tag.displayName];
  };

  const getLevel = (tagId: number): number => {
    const tag = tagMap.get(tagId);
    if (!tag || !tag.parentTagId) return 0;
    return getLevel(tag.parentTagId) + 1;
  };

  const isDescendantOf = (tagId: number, ancestorId: number): boolean => {
    const tag = tagMap.get(tagId);
    if (!tag) return false;
    if (tag.parentTagId === ancestorId) return true;
    if (tag.parentTagId) return isDescendantOf(tag.parentTagId, ancestorId);
    return false;
  };

  return tags
    .filter((tag) => {
      // Exclude the current tag and its descendants to prevent circular references
      if (excludeTagId) {
        return tag.id !== excludeTagId && !isDescendantOf(tag.id, excludeTagId);
      }
      return true;
    })
    .map((tag) => ({
      tag,
      level: getLevel(tag.id),
      path: getPath(tag.id),
    }))
    .sort((a, b) => {
      // Sort by path to maintain hierarchy
      const pathA = a.path.join(" > ").toLowerCase();
      const pathB = b.path.join(" > ").toLowerCase();
      return pathA.localeCompare(pathB);
    });
};

export const ParentTagSelector = ({
  tags,
  selectedParentId,
  currentTagId,
  onSelectParent,
  placeholder = "Select parent tag...",
}: ParentTagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const hierarchicalTags = useMemo(
    () => buildHierarchicalList(tags, currentTagId),
    [tags, currentTagId]
  );

  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) return hierarchicalTags;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return hierarchicalTags.filter(
      (item) =>
        item.tag.displayName.toLowerCase().includes(lowerSearchTerm) ||
        item.path.some((pathPart) => pathPart.toLowerCase().includes(lowerSearchTerm))
    );
  }, [hierarchicalTags, searchTerm]);

  const selectedTag = selectedParentId ? tags.find((tag) => tag.id === selectedParentId) : null;

  const getDisplayValue = () => {
    if (!selectedTag) return placeholder;

    const item = hierarchicalTags.find((item) => item.tag.id === selectedParentId);
    if (item && item.path.length > 1) {
      return item.path.join(" > ");
    }
    return selectedTag.displayName;
  };

  const handleSelect = (parentId: number | null) => {
    onSelectParent(parentId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          <span className={cn("truncate", !selectedTag && "text-gray-500")}>
            {getDisplayValue()}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align="start">
        <TagSearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search tags..." />

        <HierarchicalTagList
          items={filteredTags}
          selectedTagId={selectedParentId}
          onSelectTag={handleSelect}
          searchTerm={searchTerm}
        />
      </PopoverContent>
    </Popover>
  );
};
