import { CreateTagDimensionDto, UpdateTagDimensionDto } from "../../../../features/tags/api-type";
import { TagDimension } from "../../../../features/tags/entity";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { TagDimensionForm } from "./TagDimensionForm";

export type EditingDimension =
  | {
      dimension: TagDimension;
      mode: "edit";
    }
  | {
      mode: "create";
    };

type DimensionDialogProps = {
  editingDimension: EditingDimension | null;
  onClose: () => void;
  onSubmit: (data: CreateTagDimensionDto | { id: number; dto: UpdateTagDimensionDto }) => void;
  isSubmitting: boolean;
};

export const DimensionDialog = ({
  editingDimension,
  onClose,
  onSubmit,
  isSubmitting,
}: DimensionDialogProps) => {
  const getDialogTitle = () => {
    return editingDimension?.mode === "edit" ? "Edit Tag Dimension" : "Create New Tag Dimension";
  };

  const getDialogDescription = () => {
    const action = editingDimension?.mode === "edit" ? "Update" : "Create";
    return editingDimension?.mode === "edit"
      ? `${action} the "${editingDimension.dimension.name}" dimension settings.`
      : `${action} a new dimension to organize your tags. Choose the data type that best fits the kind of information you want to track.`;
  };

  const handleFormSubmit = (data: CreateTagDimensionDto | UpdateTagDimensionDto) => {
    if (editingDimension?.mode === "edit") {
      onSubmit({
        id: editingDimension.dimension.id,
        dto: data as UpdateTagDimensionDto,
      });
    } else {
      onSubmit(data as CreateTagDimensionDto);
    }
  };

  return (
    <Dialog open={!!editingDimension} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <TagDimensionForm
          initialData={editingDimension?.mode === "edit" ? editingDimension.dimension : undefined}
          onSubmit={handleFormSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
