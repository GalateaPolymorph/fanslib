import { List, Plus, TreePine } from "lucide-react";
import { useState } from "react";
import { CreateTagDefinitionDto, CreateTagDimensionDto } from "../../../../features/tags/api-type";
import { TagDefinition, TagDimension } from "../../../../features/tags/entity";
import { TagDragProvider } from "../../contexts/TagDragContext";
import {
  useCreateTagDefinition,
  useCreateTagDimension,
  useDeleteTagDefinition,
  useDeleteTagDimension,
  useTagDimensions,
  useUpdateTagDefinition,
} from "../../hooks/tags";
import { Button } from "../ui/button";
import { DeleteTagDialog } from "./DeleteTagDialog";
import { DimensionCard } from "./DimensionCard";
import { DimensionCreationDialog } from "./DimensionCreationDialog";
import { TagDialog } from "./TagDialog";

type EditingTag =
  | {
      tag: TagDefinition;
      mode: "edit";
    }
  | {
      parentTagId?: number;
      dimensionId: number;
      mode: "create";
    };

export const TagDimensionManager = () => {
  const [isCreatingDimension, setIsCreatingDimension] = useState(false);
  const [editingTag, setEditingTag] = useState<EditingTag | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "tree">("tree");
  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);

  const [newDimension, setNewDimension] = useState<CreateTagDimensionDto>({
    name: "",
    description: "",
    dataType: "categorical",
  });

  const { data: dimensions, isLoading } = useTagDimensions();
  const createDimensionMutation = useCreateTagDimension();
  const createTagMutation = useCreateTagDefinition();
  const updateTagMutation = useUpdateTagDefinition();
  const deleteDimensionMutation = useDeleteTagDimension();
  const deleteTagMutation = useDeleteTagDefinition();

  const createDimension = () => {
    if (newDimension.name.trim()) {
      createDimensionMutation.mutate(newDimension, {
        onSuccess: () => {
          setIsCreatingDimension(false);
          setNewDimension({ name: "", description: "", dataType: "categorical" });
        },
      });
    }
  };

  const handleTagSubmit = (data: CreateTagDefinitionDto | { id: number; dto: any }) => {
    if ("id" in data) {
      // Update existing tag
      updateTagMutation.mutate(data, {
        onSuccess: () => {
          setEditingTag(null);
        },
      });
    } else {
      // Create new tag
      createTagMutation.mutate(data as CreateTagDefinitionDto, {
        onSuccess: () => {
          setEditingTag(null);
        },
      });
    }
  };

  const handleCreateTag = (dimensionId: number, parentTagId?: number) => {
    setEditingTag({
      parentTagId,
      dimensionId,
      mode: "create",
    });
  };

  const handleEditTag = (tag: TagDefinition) => {
    setEditingTag({
      tag,
      mode: "edit",
    });
  };

  const handleUpdateParent = (tagId: number, newParentId: number | null) => {
    console.log("handleUpdateParent called", { tagId, newParentId });

    const tag = dimensions?.flatMap((d) => d.tags || []).find((t) => t.id === tagId);
    console.log("Found tag:", tag?.displayName);

    if (tag) {
      console.log("Calling updateTagMutation.mutate");
      updateTagMutation.mutate(
        {
          id: tagId,
          dto: {
            parentTagId: newParentId,
          },
        },
        {
          onSuccess: (result) => {
            console.log("Update mutation succeeded:", result);
          },
          onError: (error) => {
            console.error("Update mutation failed:", error);
          },
        }
      );
    } else {
      console.log("Tag not found in dimensions");
    }
  };

  const handleDeleteTag = (tagId: number) => {
    setDeletingTagId(tagId);
  };

  const confirmDeleteTag = () => {
    if (deletingTagId) {
      deleteTagMutation.mutate(deletingTagId);
      if (selectedTagId === deletingTagId) {
        setSelectedTagId(null);
      }
      setDeletingTagId(null);
    }
  };

  const isSubmitting = createTagMutation.isPending || updateTagMutation.isPending;

  if (isLoading) {
    return <div className="animate-pulse">Loading dimensions...</div>;
  }

  const editingDimensionTags =
    editingTag && "dimensionId" in editingTag
      ? dimensions?.find((d) => d.id === editingTag.dimensionId)?.tags || []
      : editingTag && "tag" in editingTag
        ? dimensions?.find((d) => d.id === editingTag.tag.dimensionId)?.tags || []
        : [];

  return (
    <TagDragProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tag Dimensions</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "tree" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("tree")}
                className="rounded-r-none"
              >
                <TreePine className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={() => setIsCreatingDimension(true)} disabled={isCreatingDimension}>
              <Plus className="w-4 h-4 mr-2" />
              Add Dimension
            </Button>
          </div>
        </div>

        <DimensionCreationDialog
          isOpen={isCreatingDimension}
          onClose={() => setIsCreatingDimension(false)}
          dimension={newDimension}
          onDimensionChange={setNewDimension}
          onSubmit={createDimension}
          isSubmitting={createDimensionMutation.isPending}
        />

        <div className="grid gap-4">
          {dimensions?.map((dimension) => (
            <DimensionCard
              key={dimension.id}
              dimension={dimension}
              viewMode={viewMode}
              onDeleteDimension={(dimensionId) => deleteDimensionMutation.mutate(dimensionId)}
              onUpdateParent={handleUpdateParent}
              onDeleteTag={handleDeleteTag}
              onCreateTag={handleCreateTag}
              onEditTag={handleEditTag}
              selectedTagId={selectedTagId}
              onSelectTag={setSelectedTagId}
              isDeletingDimension={deleteDimensionMutation.isPending}
            />
          ))}
        </div>

        <TagDialog
          editingTag={editingTag}
          dimension={
            editingTag
              ? dimensions?.find((d) =>
                  editingTag.mode === "create"
                    ? d.id === editingTag.dimensionId
                    : d.id === editingTag.tag.dimensionId
                ) || ({} as TagDimension)
              : ({} as TagDimension)
          }
          availableTags={editingDimensionTags}
          onClose={() => setEditingTag(null)}
          onSubmit={handleTagSubmit}
          isSubmitting={isSubmitting}
        />

        <DeleteTagDialog
          isOpen={deletingTagId !== null}
          onConfirm={confirmDeleteTag}
          onCancel={() => setDeletingTagId(null)}
          isDeleting={deleteTagMutation.isPending}
        />
      </div>
    </TagDragProvider>
  );
};
