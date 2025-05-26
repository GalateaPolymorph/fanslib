import { useState } from "react";
import { CreateTagDimensionDto } from "../../../../features/tags/api-type";
import {
  BooleanSchema,
  NumericSchema,
  parseBooleanSchema,
  parseNumericSchema,
} from "../../lib/tagValidation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

type DimensionCreationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  dimension: CreateTagDimensionDto;
  onDimensionChange: (dimension: CreateTagDimensionDto) => void;
};

export const DimensionCreationDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  dimension,
  onDimensionChange,
}: DimensionCreationDialogProps) => {
  const [booleanSchema, setBooleanSchema] = useState<BooleanSchema>(() =>
    parseBooleanSchema(dimension.validationSchema)
  );
  const [numericSchema, setNumericSchema] = useState<NumericSchema>(() =>
    parseNumericSchema(dimension.validationSchema)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dimension.name.trim()) {
      onSubmit();
    }
  };

  const updateDimension = (updates: Partial<CreateTagDimensionDto>) => {
    onDimensionChange({ ...dimension, ...updates });
  };

  const handleDataTypeChange = (dataType: "categorical" | "numerical" | "boolean") => {
    let validationSchema = "";

    if (dataType === "boolean") {
      validationSchema = JSON.stringify(booleanSchema);
    } else if (dataType === "numerical") {
      validationSchema = JSON.stringify(numericSchema);
    }

    updateDimension({ dataType, validationSchema });
  };

  const handleBooleanSchemaChange = (schema: BooleanSchema) => {
    setBooleanSchema(schema);
    if (dimension.dataType === "boolean") {
      updateDimension({ validationSchema: JSON.stringify(schema) });
    }
  };

  const handleNumericSchemaChange = (schema: NumericSchema) => {
    setNumericSchema(schema);
    if (dimension.dataType === "numerical") {
      updateDimension({ validationSchema: JSON.stringify(schema) });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Tag Dimension</DialogTitle>
          <DialogDescription>
            Create a new dimension to organize your tags. Choose the data type that best fits the
            kind of information you want to track.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dimensionName">Dimension Name *</Label>
            <Input
              id="dimensionName"
              value={dimension.name}
              onChange={(e) => updateDimension({ name: e.target.value })}
              placeholder="e.g., Content Type, Quality, Mood"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataType">Data Type *</Label>
            <Select value={dimension.dataType} onValueChange={handleDataTypeChange}>
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={dimension.description || ""}
              onChange={(e) => updateDimension({ description: e.target.value })}
              placeholder="Optional description of what this dimension represents"
              rows={3}
            />
          </div>

          {/* Configuration sections for specific data types */}
          {dimension.dataType === "boolean" && (
            <div className="p-4 border rounded-md bg-purple-50">
              <h3 className="font-medium text-purple-900 mb-2">Boolean Configuration</h3>
              <p className="text-sm text-purple-700">
                Boolean dimensions will automatically create exactly 2 tags with custom display
                names.
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
                <div className="mt-4 p-3 bg-white rounded-md border">
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

          {dimension.dataType === "numerical" && (
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!dimension.name.trim() || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Dimension"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
