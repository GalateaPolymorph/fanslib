import { Edit, Trash2 } from "lucide-react";
import { TagDefinition } from "../../../../../../features/tags/entity";
import { Button } from "../../../../components/ui/Button";
import { cn } from "../../../../lib/utils";

type TagListItemProps = {
  tag: TagDefinition;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const TagListItem = ({
  tag,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}: TagListItemProps) => {
  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete the tag "${tag.displayName}"? This action cannot be undone.`
      )
    ) {
      onDelete();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border transition-colors group hover:bg-gray-50",
        isSelected && "bg-blue-50 border-blue-200"
      )}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{tag.displayName}</div>
        {tag.description && (
          <div className="text-xs text-gray-500 mt-1 truncate">{tag.description}</div>
        )}
        <div className="text-xs text-gray-400 mt-1">Value: {tag.value}</div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="Edit tag"
        >
          <Edit className="w-3 h-3" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          title="Delete tag"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
