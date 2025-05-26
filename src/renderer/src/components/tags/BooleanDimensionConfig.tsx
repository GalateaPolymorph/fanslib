import { useState } from "react";
import { BooleanSchema } from "../../lib/tagValidation";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type BooleanDimensionConfigProps = {
  schema: BooleanSchema;
  onChange: (schema: BooleanSchema) => void;
};

export const BooleanDimensionConfig = ({ schema, onChange }: BooleanDimensionConfigProps) => {
  const [trueLabel, setTrueLabel] = useState(schema.trueLabel || "Yes");
  const [falseLabel, setFalseLabel] = useState(schema.falseLabel || "No");
  const [defaultValue, setDefaultValue] = useState(schema.defaultValue ?? false);

  const updateSchema = (updates: Partial<BooleanSchema>) => {
    const newSchema = { ...schema, ...updates };
    onChange(newSchema);
  };

  const handleTrueLabelChange = (value: string) => {
    setTrueLabel(value);
    updateSchema({ trueLabel: value });
  };

  const handleFalseLabelChange = (value: string) => {
    setFalseLabel(value);
    updateSchema({ falseLabel: value });
  };

  const handleDefaultValueChange = (value: boolean) => {
    setDefaultValue(value);
    updateSchema({ defaultValue: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Boolean Configuration</CardTitle>
        <CardDescription>
          Configure display names for true and false values. This will create exactly 2 tags for
          this dimension.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trueLabel">True Value Display Name</Label>
            <Input
              id="trueLabel"
              value={trueLabel}
              onChange={(e) => handleTrueLabelChange(e.target.value)}
              placeholder="e.g., Yes, Enabled, Featured"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="falseLabel">False Value Display Name</Label>
            <Input
              id="falseLabel"
              value={falseLabel}
              onChange={(e) => handleFalseLabelChange(e.target.value)}
              placeholder="e.g., No, Disabled, Not Featured"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Default Value</Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={defaultValue === true ? "default" : "outline"}
              size="sm"
              onClick={() => handleDefaultValueChange(true)}
            >
              {trueLabel}
            </Button>
            <Button
              type="button"
              variant={defaultValue === false ? "default" : "outline"}
              size="sm"
              onClick={() => handleDefaultValueChange(false)}
            >
              {falseLabel}
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Preview:</strong> This dimension will automatically create two tags:
          </p>
          <div className="flex gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {trueLabel}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {falseLabel}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
