import { CreateTagDefinitionDto, UpdateTagDefinitionDto } from "../../../../features/tags/api-type";
import { TagDefinition, TagDimension } from "../../../../features/tags/entity";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { TagForm } from "./TagForm";

type TagEditDialogProps = {
  isOpen: boolean;
  dimension: TagDimension;
  availableTags: TagDefinition[];
  initialData?: TagDefinition;
  onSubmit: (data: CreateTagDefinitionDto | UpdateTagDefinitionDto) => void;
  onClose: () => void;
  isSubmitting?: boolean;
};

export const TagEditDialog = ({
  isOpen,
  dimension,
  availableTags,
  initialData,
  onSubmit,
  onClose,
  isSubmitting = false,
}: TagEditDialogProps) => {
  const isEditing = !!initialData;
  const dataTypeLabel =
    dimension.dataType === "numerical"
      ? "Numeric"
      : dimension.dataType === "boolean"
        ? "Boolean"
        : "Categorical";

  const title = isEditing ? `Edit ${dataTypeLabel} Tag` : `Create ${dataTypeLabel} Tag`;
  const description = `${isEditing ? "Update" : "Add"} a ${dimension.dataType} tag in the "${dimension.name}" dimension.`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <TagForm
          dimension={dimension}
          availableTags={availableTags}
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
