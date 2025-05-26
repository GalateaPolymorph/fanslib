import { ChevronRight } from "lucide-react";
import { TagDefinition } from "../../../../features/tags/entity";
import { cn } from "../../lib/utils";

type TagBreadcrumbProps = {
  tags: TagDefinition[];
  onTagClick?: (tag: TagDefinition) => void;
  className?: string;
};

export const TagBreadcrumb = ({ tags, onTagClick, className }: TagBreadcrumbProps) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {tags.map((tag, index) => (
        <div key={tag.id} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
          <button
            onClick={() => onTagClick?.(tag)}
            className={cn(
              "text-gray-600 hover:text-gray-900 transition-colors",
              index === tags.length - 1 && "font-medium text-gray-900",
              onTagClick && "hover:underline"
            )}
            disabled={!onTagClick}
          >
            {tag.displayName}
          </button>
        </div>
      ))}
    </nav>
  );
};
