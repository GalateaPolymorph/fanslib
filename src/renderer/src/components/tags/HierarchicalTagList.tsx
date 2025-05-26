import { Check } from "lucide-react";
import { TagDefinition } from "../../../../features/tags/entity";
import { cn } from "../../lib/utils";

export type TagHierarchyItem = {
  tag: TagDefinition;
  level: number;
  path: string[];
};

type HierarchicalTagListProps = {
  items: TagHierarchyItem[];
  selectedTagId?: number | null;
  onSelectTag: (tagId: number | null) => void;
  showNoParentOption?: boolean;
  noParentLabel?: string;
  emptyMessage?: string;
  searchTerm?: string;
};

export const HierarchicalTagList = ({
  items,
  selectedTagId,
  onSelectTag,
  showNoParentOption = true,
  noParentLabel = "No parent (root level)",
  emptyMessage = "No tags found",
  searchTerm,
}: HierarchicalTagListProps) => {
  return (
    <div className="max-h-60 overflow-y-auto">
      {showNoParentOption && (
        <div
          className={cn(
            "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50",
            selectedTagId === null && "bg-blue-50"
          )}
          onClick={() => onSelectTag(null)}
        >
          <Check
            className={cn("mr-2 h-4 w-4", selectedTagId === null ? "opacity-100" : "opacity-0")}
          />
          <span className="text-gray-600 italic">{noParentLabel}</span>
        </div>
      )}

      {items.length === 0 && searchTerm ? (
        <div className="px-3 py-2 text-gray-500 text-sm">
          {emptyMessage} matching &ldquo;{searchTerm}&rdquo;
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.tag.id}
            className={cn(
              "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50",
              selectedTagId === item.tag.id && "bg-blue-50"
            )}
            style={{ paddingLeft: `${12 + item.level * 16}px` }}
            onClick={() => onSelectTag(item.tag.id)}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                selectedTagId === item.tag.id ? "opacity-100" : "opacity-0"
              )}
            />

            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{item.tag.displayName}</div>
              {item.level > 0 && (
                <div className="text-xs text-gray-500 truncate">
                  {item.path.slice(0, -1).join(" > ")}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
