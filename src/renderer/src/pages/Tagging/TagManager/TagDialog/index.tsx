import { useState } from "react";
import {
  CreateTagDefinitionDto,
  UpdateTagDefinitionDto,
} from "../../../../../../features/tags/api-type";
import { TagDefinition, TagDimension } from "../../../../../../features/tags/entity";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  convertFromTagValue,
  convertToTagValue,
  getDefaultValue,
  parseBooleanSchema,
  parseNumericSchema,
} from "../../../../lib/tagValidation";
import { BooleanValueInput } from "./BooleanValueInput";
import { CategoricalValueInput } from "./CategoricalValueInput";
import { NumericValueInput } from "./NumericValueInput";

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

type TagDialogProps = {
  editingTag: EditingTag | null;
  dimension: TagDimension;
  availableTags: TagDefinition[];
  onClose: () => void;
  onSubmit: (data: CreateTagDefinitionDto | { id: number; dto: UpdateTagDefinitionDto }) => void;
  isSubmitting: boolean;
};

export const TagDialog = ({
  editingTag,
  dimension,
  availableTags,
  onClose,
  onSubmit,
  isSubmitting,
}: TagDialogProps) => {
  const isNumeric = dimension.dataType === "numerical";
  const isBoolean = dimension.dataType === "boolean";
  const isCategorical = dimension.dataType === "categorical";

  // Initialize form state based on editing mode and data type
  const getInitialFormData = () => {
    if (editingTag?.mode === "edit") {
      const tag = editingTag.tag;
      return {
        displayName: tag.displayName,
        value: tag.value,
        description: tag.description || "",
        parentTagId: tag.parentTagId || null,
        shortRepresentation: tag.shortRepresentation || "",
        typedValue: convertFromTagValue(tag.value, dimension.dataType),
      };
    }

    const defaultValue = getDefaultValue(dimension);
    return {
      displayName: "",
      value: "",
      description: "",
      parentTagId: editingTag?.parentTagId || null,
      shortRepresentation: "",
      typedValue: defaultValue,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (validationError || !formData.displayName.trim()) {
      return;
    }

    let finalValue = formData.value;

    // For numeric and boolean types, use the typed value
    if (isNumeric || isBoolean) {
      finalValue = convertToTagValue(formData.typedValue, dimension.dataType);
    } else if (isCategorical && !finalValue) {
      // Auto-generate value for categorical if empty
      finalValue = formData.displayName.toLowerCase().replace(/\s+/g, "-");
    }

    const baseData = {
      value: finalValue,
      displayName: formData.displayName.trim(),
      description: formData.description.trim() || undefined,
      ...(isCategorical && {
        parentTagId: formData.parentTagId,
        shortRepresentation: formData.shortRepresentation.trim() || undefined,
      }),
    };

    if (editingTag?.mode === "edit") {
      onSubmit({
        id: editingTag.tag.id,
        dto: baseData,
      });
    } else {
      onSubmit({
        ...baseData,
        dimensionId: dimension.id,
      } as CreateTagDefinitionDto);
    }
  };

  const getDialogTitle = () => {
    const typeLabel = isNumeric ? "Numeric" : isBoolean ? "Boolean" : "Categorical";
    return editingTag?.mode === "edit" ? `Edit ${typeLabel} Tag` : `Create ${typeLabel} Tag`;
  };

  const getDialogDescription = () => {
    const action = editingTag?.mode === "edit" ? "Update" : "Add";
    const typeLabel = dimension.dataType;
    return `${action} a ${typeLabel} tag in the "${dimension.name}" dimension.`;
  };

  const renderValueInput = () => {
    if (isNumeric) {
      const schema = parseNumericSchema(dimension.validationSchema);
      return (
        <NumericValueInput
          value={formData.typedValue as number}
          onChange={(value) => setFormData((prev) => ({ ...prev, typedValue: value }))}
          schema={schema}
          onValidationChange={setValidationError}
        />
      );
    }

    if (isBoolean) {
      const schema = parseBooleanSchema(dimension.validationSchema);
      return (
        <BooleanValueInput
          value={formData.typedValue as boolean}
          onChange={(value) => setFormData((prev) => ({ ...prev, typedValue: value }))}
          schema={schema}
        />
      );
    }

    if (isCategorical) {
      return (
        <CategoricalValueInput
          displayName={formData.displayName}
          value={formData.value}
          description={formData.description}
          parentTagId={formData.parentTagId}
          shortRepresentation={formData.shortRepresentation}
          availableTags={availableTags}
          currentTagId={editingTag?.mode === "edit" ? editingTag.tag.id : undefined}
          onDisplayNameChange={(value) => setFormData((prev) => ({ ...prev, displayName: value }))}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, value }))}
          onDescriptionChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
          onParentTagChange={(parentId) =>
            setFormData((prev) => ({ ...prev, parentTagId: parentId }))
          }
          onShortRepresentationChange={(value) => {
            setFormData((prev) => ({ ...prev, shortRepresentation: value }));
          }}
        />
      );
    }

    return null;
  };

  return (
    <Dialog open={!!editingTag} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* For numeric and boolean, show display name input at top */}
          {(isNumeric || isBoolean) && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Tag Name *</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                placeholder={
                  isNumeric ? "e.g., Duration, Count, Rating" : "e.g., Is Featured, Has Audio"
                }
                required
              />
            </div>
          )}

          {/* Render appropriate value input based on data type */}
          {renderValueInput()}

          {/* For numeric and boolean, show description input at bottom */}
          {(isNumeric || isBoolean) && (
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this tag"
              />
            </div>
          )}

          {/* Show validation error */}
          {validationError && <p className="text-xs text-red-600">{validationError}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !!validationError || !formData.displayName.trim()}
          >
            {isSubmitting ? "Saving..." : editingTag?.mode === "edit" ? "Update Tag" : "Create Tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
