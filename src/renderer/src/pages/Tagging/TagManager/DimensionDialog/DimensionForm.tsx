import { useState } from "react";
import {
  CreateTagDimensionDto,
  UpdateTagDimensionDto,
} from "../../../../../../features/tags/api-type";
import { TagDimension } from "../../../../../../features/tags/entity";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import {
  BooleanSchema,
  NumericSchema,
  parseBooleanSchema,
  parseNumericSchema,
} from "../../../../lib/tagValidation";

type DimensionFormProps = {
  initialData?: TagDimension;
  onSubmit: (data: CreateTagDimensionDto | UpdateTagDimensionDto) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const DimensionForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DimensionFormProps) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<CreateTagDimensionDto>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    dataType: initialData?.dataType || "categorical",
    validationSchema: initialData?.validationSchema || "",
    sortOrder: initialData?.sortOrder || 0,
    stickerDisplay: initialData?.stickerDisplay || "none",
  });

  const [booleanSchema, setBooleanSchema] = useState<BooleanSchema>(() =>
    parseBooleanSchema(formData.validationSchema)
  );
  const [numericSchema, setNumericSchema] = useState<NumericSchema>(() =>
    parseNumericSchema(formData.validationSchema)
  );

  const updateFormData = (updates: Partial<CreateTagDimensionDto>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleDataTypeChange = (dataType: "categorical" | "numerical" | "boolean") => {
    let validationSchema = "";

    if (dataType === "boolean") {
      validationSchema = JSON.stringify(booleanSchema);
    } else if (dataType === "numerical") {
      validationSchema = JSON.stringify(numericSchema);
    }

    updateFormData({ dataType, validationSchema });
  };

  const handleBooleanSchemaChange = (schema: BooleanSchema) => {
    setBooleanSchema(schema);
    if (formData.dataType === "boolean") {
      updateFormData({ validationSchema: JSON.stringify(schema) });
    }
  };

  const handleNumericSchemaChange = (schema: NumericSchema) => {
    setNumericSchema(schema);
    if (formData.dataType === "numerical") {
      updateFormData({ validationSchema: JSON.stringify(schema) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      ...(isEditing
        ? {
            validationSchema: formData.validationSchema || undefined,
            sortOrder: formData.sortOrder,
            stickerDisplay: formData.stickerDisplay,
          }
        : {
            dataType: formData.dataType,
            validationSchema: formData.validationSchema || undefined,
            sortOrder: formData.sortOrder,
            stickerDisplay: formData.stickerDisplay,
          }),
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dimensionName">Dimension Name *</Label>
        <Input
          id="dimensionName"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="e.g., Content Type, Quality, Mood"
          required
        />
      </div>

      {!isEditing && (
        <div className="space-y-2">
          <Label htmlFor="dataType">Data Type *</Label>
          <Select value={formData.dataType} onValueChange={handleDataTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="categorical">
                <div>
                  <div className="font-medium">Categorical</div>
                  <div className="text-xs text-gray-500">
                    Text-based tags with optional hierarchy (e.g., Genre, Style)
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="numerical">
                <div>
                  <div className="font-medium">Numerical</div>
                  <div className="text-xs text-gray-500">
                    Numeric values with ranges (e.g., Rating, Duration)
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="boolean">
                <div>
                  <div className="font-medium">Boolean</div>
                  <div className="text-xs text-gray-500">
                    True/false values (e.g., Is Featured, Has Audio)
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Optional description of what this dimension represents"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stickerDisplay">Sticker Display Mode</Label>
        <Select
          value={formData.stickerDisplay || "none"}
          onValueChange={(value: "none" | "color" | "short") =>
            updateFormData({ stickerDisplay: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sticker display mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <div>
                <div className="font-medium">None</div>
                <div className="text-xs text-gray-500">
                  No visual stickers displayed for tags in this dimension
                </div>
              </div>
            </SelectItem>
            <SelectItem value="color">
              <div>
                <div className="font-medium">Color</div>
                <div className="text-xs text-gray-500">
                  Show colored dots/badges for categorical tags
                </div>
              </div>
            </SelectItem>
            <SelectItem value="short">
              <div>
                <div className="font-medium">Short Text</div>
                <div className="text-xs text-gray-500">
                  Show short text representations for tags
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Configuration sections for specific data types */}
      {formData.dataType === "boolean" && (
        <div className="p-4 border rounded-md bg-purple-50">
          <h3 className="font-medium text-purple-900 mb-2">Boolean Configuration</h3>
          <p className="text-sm text-purple-700">
            Boolean dimensions will automatically create exactly 2 tags with custom display names.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="trueLabel">True Value Display Name</Label>
              <Input
                id="trueLabel"
                value={booleanSchema.trueLabel || "Yes"}
                onChange={(e) =>
                  handleBooleanSchemaChange({ ...booleanSchema, trueLabel: e.target.value })
                }
                placeholder="e.g., Yes, Enabled, Featured"
              />
            </div>
            <div>
              <Label htmlFor="falseLabel">False Value Display Name</Label>
              <Input
                id="falseLabel"
                value={booleanSchema.falseLabel || "No"}
                onChange={(e) =>
                  handleBooleanSchemaChange({ ...booleanSchema, falseLabel: e.target.value })
                }
                placeholder="e.g., No, Disabled, Not Featured"
              />
            </div>

            {/* Boolean Preview */}
            <div className="mt-4 p-3 bg-white rounded-md border col-span-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Tag Preview:</p>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {booleanSchema.trueLabel || "Yes"}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {booleanSchema.falseLabel || "No"}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                This dimension will automatically create exactly 2 tags with these names.
              </p>
            </div>
          </div>
        </div>
      )}

      {formData.dataType === "numerical" && (
        <div className="p-4 border rounded-md bg-green-50">
          <h3 className="font-medium text-green-900 mb-2">Numeric Configuration</h3>
          <p className="text-sm text-green-700 mb-3">
            Configure the range and step size for numeric values.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="min">Minimum</Label>
              <Input
                id="min"
                type="number"
                value={numericSchema.min ?? 0}
                onChange={(e) =>
                  handleNumericSchemaChange({
                    ...numericSchema,
                    min: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="max">Maximum</Label>
              <Input
                id="max"
                type="number"
                value={numericSchema.max ?? 100}
                onChange={(e) =>
                  handleNumericSchemaChange({
                    ...numericSchema,
                    max: parseFloat(e.target.value) || 100,
                  })
                }
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="step">Step</Label>
              <Input
                id="step"
                type="number"
                value={numericSchema.step ?? 1}
                onChange={(e) =>
                  handleNumericSchemaChange({
                    ...numericSchema,
                    step: parseFloat(e.target.value) || 1,
                  })
                }
                placeholder="1"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>
          <div className="mt-3">
            <Label htmlFor="unit">Unit (Optional)</Label>
            <Input
              id="unit"
              value={numericSchema.unit || ""}
              onChange={(e) =>
                handleNumericSchemaChange({ ...numericSchema, unit: e.target.value })
              }
              placeholder="e.g., %, seconds, MB, points"
            />
          </div>

          {/* Range Visualization */}
          <div className="mt-4 p-3 bg-white rounded-md border">
            <p className="text-sm font-medium text-gray-700 mb-2">Range Preview:</p>
            <div className="relative">
              <div className="h-6 bg-gradient-to-r from-green-200 via-green-300 to-green-400 rounded-md relative">
                <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium text-green-800">
                  <span>
                    {numericSchema.min ?? 0}
                    {numericSchema.unit && ` ${numericSchema.unit}`}
                  </span>
                  <span>
                    {numericSchema.max ?? 100}
                    {numericSchema.unit && ` ${numericSchema.unit}`}
                  </span>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Step: {numericSchema.step ?? 1}
                {numericSchema.unit && ` ${numericSchema.unit}`} • Possible values:{" "}
                {Math.floor(
                  ((numericSchema.max ?? 100) - (numericSchema.min ?? 0)) /
                    (numericSchema.step ?? 1)
                ) + 1}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={!formData.name.trim() || isSubmitting}>
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Dimension"
              : "Create Dimension"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
