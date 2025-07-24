import { MoreHorizontal, PenLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { TagDefinition, TagDimension } from "../../../../../../features/tags/entity";
import { Button } from "../../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/DropdownMenu";
import { cn } from "../../../../lib/utils";
import { DeleteDimensionDialog } from "../DeleteDimensionDialog";
import { TagListView } from "./TagListView";
import { TagTreeView } from "./TagTreeView";

type DimensionCardProps = {
  dimension: TagDimension;
  viewMode: "list" | "tree";
  selectedTagId?: number;
  onCreateTag: (dimensionId: number, parentTagId?: number) => void;
  onEditTag: (tag: TagDefinition) => void;
  onDeleteTag: (tagId: number) => void;
  onDeleteDimension: (dimensionId: number) => void;
  onEditDimension?: (dimension: TagDimension) => void;
  onUpdateParent: (tagId: number, newParentId: number | null) => void;
  onSelectTag?: (tagId: number) => void;
  isDeletingDimension?: boolean;
};

export const DimensionCard = ({
  dimension,
  viewMode,
  selectedTagId,
  onCreateTag,
  onEditTag,
  onDeleteTag,
  onDeleteDimension,
  onEditDimension,
  onUpdateParent,
  onSelectTag,
  isDeletingDimension = false,
}: DimensionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getDataTypeLabel = (dataType: string) => {
    switch (dataType) {
      case "categorical":
        return "Categorical";
      case "numerical":
        return "Numeric";
      case "boolean":
        return "Boolean";
      default:
        return dataType;
    }
  };

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case "categorical":
        return "bg-blue-100 text-blue-800";
      case "numerical":
        return "bg-green-100 text-green-800";
      case "boolean":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteDimension = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteDimension = () => {
    onDeleteDimension(dimension.id);
    setShowDeleteDialog(false);
  };

  const handleEditDimension = () => {
    onEditDimension?.(dimension);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? "−" : "+"}
            </Button>
            <div>
              <CardTitle className="text-lg">{dimension.name}</CardTitle>
              {dimension.description && (
                <p className="text-sm text-gray-600 mt-1">{dimension.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getDataTypeColor(dimension.dataType)
              )}
            >
              {getDataTypeLabel(dimension.dataType)}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateTag(dimension.id)}
              className="h-8"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Tag
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditDimension}>
                  <PenLine className="w-4 h-4 mr-2" />
                  Edit Dimension
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteDimension} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Dimension
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {dimension.tags && dimension.tags.length > 0 ? (
            viewMode === "tree" ? (
              <TagTreeView
                tags={dimension.tags}
                selectedTagId={selectedTagId}
                onSelectTag={onSelectTag}
                onEditTag={onEditTag}
                onDeleteTag={onDeleteTag}
                onCreateTag={(parentTagId) => onCreateTag(dimension.id, parentTagId)}
                onUpdateParent={onUpdateParent}
              />
            ) : (
              <TagListView
                tags={dimension.tags}
                selectedTagId={selectedTagId}
                onSelectTag={onSelectTag}
                onEditTag={onEditTag}
                onDeleteTag={onDeleteTag}
              />
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No tags in this dimension yet.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCreateTag(dimension.id)}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create First Tag
              </Button>
            </div>
          )}
        </CardContent>
      )}

      <DeleteDimensionDialog
        isOpen={showDeleteDialog}
        dimension={dimension}
        onConfirm={confirmDeleteDimension}
        onCancel={() => setShowDeleteDialog(false)}
        isDeleting={isDeletingDimension}
      />
    </Card>
  );
};
