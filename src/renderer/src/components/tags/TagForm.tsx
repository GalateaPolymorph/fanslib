import { useState } from "react";
import { CreateTagDefinitionDto, UpdateTagDefinitionDto } from "../../../../features/tags/api-type";
import { TagDefinition, TagDimension } from "../../../../features/tags/entity";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { BooleanValueInput } from "./BooleanValueInput";
import { CategoricalValueInput } from "./CategoricalValueInput";
import { NumericValueInput } from "./NumericValueInput";

type TagFormProps = {
  dimension: TagDimension;
  availableTags: TagDefinition[];
  initialData?: TagDefinition;
  onSubmit: (data: CreateTagDefinitionDto | UpdateTagDefinitionDto) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const TagForm = ({
  dimension,
  availableTags,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TagFormProps) => {
  const isEditing = !!initialData;
  const isNumeric = dimension.dataType === "numerical";
  const isBoolean = dimension.dataType === "boolean";
  const isCategorical = dimension.dataType === "categorical";

  const [formData, setFormData] = useState({
    displayName: initialData?.displayName || "",
    value: initialData?.value || "",
    description: initialData?.description || "",
    parentTagId: initialData?.parentTagId || null,
    typedValue: isNumeric
      ? parseFloat(initialData?.value || "0")
      : isBoolean
        ? initialData?.value?.toLowerCase() === "true"
        : initialData?.value || "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validationError || !formData.displayName.trim()) {
      return;
    }

    let finalValue = formData.value;

    // For numeric and boolean types, use the typed value
    if (isNumeric || isBoolean) {
      finalValue = formData.typedValue.toString();
    } else if (isCategorical && !finalValue) {
      // Auto-generate value for categorical if empty
      finalValue = formData.displayName.toLowerCase().replace(/\s+/g, "-");
    }

    const submitData = {
      value: finalValue,
      displayName: formData.displayName.trim(),
      description: formData.description.trim() || undefined,
      ...(isCategorical && { parentTagId: formData.parentTagId }),
      ...(!isEditing && { dimensionId: dimension.id }),
    };

    onSubmit(submitData);
  };

  const renderValueInput = () => {
    if (isNumeric) {
      return (
        <NumericValueInput
          value={formData.typedValue as number}
          onChange={(value) => setFormData((prev) => ({ ...prev, typedValue: value }))}
          schema={{ min: 0, step: 1 }} // You might want to parse this from dimension.validationSchema
          onValidationChange={setValidationError}
        />
      );
    }

    if (isBoolean) {
      return (
        <BooleanValueInput
          value={formData.typedValue as boolean}
          onChange={(value) => setFormData((prev) => ({ ...prev, typedValue: value }))}
          schema={{ trueLabel: "Yes", falseLabel: "No" }} // You might want to parse this from dimension.validationSchema
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
          availableTags={availableTags}
          currentTagId={initialData?.id}
          onDisplayNameChange={(value) => setFormData((prev) => ({ ...prev, displayName: value }))}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, value }))}
          onDescriptionChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
          onParentTagChange={(parentId) =>
            setFormData((prev) => ({ ...prev, parentTagId: parentId }))
          }
        />
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {renderValueInput()}

      {/* For numeric and boolean, show description at bottom */}
      {(isNumeric || isBoolean) && (
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Optional description for this tag"
            rows={3}
          />
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={!formData.displayName.trim() || isSubmitting || !!validationError}
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Tag"
              : "Create Tag"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
