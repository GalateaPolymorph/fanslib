import { ChevronDown, ChevronRight, Edit, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { TagDefinition } from "../../../../features/tags/entity";
import { useTagDrag } from "../../contexts/TagDragContext";
import { useTagDropZone } from "../../hooks/tags/useTagDropZone";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export type TreeNode = TagDefinition & {
  children: TreeNode[];
  level: number;
};

type TreeNodeComponentProps = {
  node: TreeNode;
  onUpdateParent: (tagId: number, newParentId: number | null) => void;
  onDeleteTag: (tagId: number) => void;
  onCreateTag: (parentTagId?: number) => void;
  onEditTag: (tag: TagDefinition) => void;
  selectedTagId?: number;
  onSelectTag?: (tagId: number) => void;
  allTags: TagDefinition[];
};

export const TreeNodeComponent = ({
  node,
  onUpdateParent,
  onDeleteTag,
  onCreateTag,
  onEditTag,
  selectedTagId,
  onSelectTag,
  allTags,
}: TreeNodeComponentProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { startTagDrag } = useTagDrag();
  const { isOver, dragHandlers } = useTagDropZone({
    targetTag: node,
    allTags,
    onUpdateParent,
  });

  const hasChildren = node.children.length > 0;
  const isSelected = selectedTagId === node.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded group hover:bg-gray-50 transition-colors",
          isSelected && "bg-blue-50 border border-blue-200",
          isOver && "bg-purple-100 border-2 border-purple-300 border-dashed"
        )}
        style={{ marginLeft: `${node.level * 20}px` }}
        {...dragHandlers}
        onClick={() => onSelectTag?.(node.id)}
      >
        <div
          className="cursor-move"
          draggable
          onDragStart={(e) => startTagDrag(e, node)}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />
        </div>

        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </Button>
        ) : (
          <div className="w-4" />
        )}

        <span className="flex-1 text-sm font-medium">{node.displayName}</span>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onCreateTag(node.id);
            }}
            title="Add child tag"
            aria-label={`Add child tag to ${node.displayName}`}
          >
            <Plus className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEditTag(node);
            }}
            title="Edit tag"
            aria-label={`Edit ${node.displayName}`}
          >
            <Edit className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTag(node.id);
            }}
            title="Delete tag"
            aria-label={`Delete ${node.displayName}`}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div role="group">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child as TreeNode}
              onUpdateParent={onUpdateParent}
              onDeleteTag={onDeleteTag}
              onCreateTag={onCreateTag}
              onEditTag={onEditTag}
              selectedTagId={selectedTagId}
              onSelectTag={onSelectTag}
              allTags={allTags}
            />
          ))}
        </div>
      )}
    </div>
  );
};
