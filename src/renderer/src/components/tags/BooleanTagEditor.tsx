import { useState } from "react";
import { TagDefinition } from "../../../../features/tags/entity";
import { formatBooleanValue, parseBooleanSchema } from "../../lib/tagValidation";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type BooleanTagEditorProps = {
  tag: TagDefinition;
  onSave: (value: string) => void;
  onCancel: () => void;
};

export const BooleanTagEditor = ({ tag, onSave, onCancel }: BooleanTagEditorProps) => {
  const schema = parseBooleanSchema(tag.dimension?.validationSchema);
  const currentValue = tag.value.toLowerCase() === "true";
  const [value, setValue] = useState(currentValue);

  const handleSave = () => {
    onSave(value.toString());
  };

  const trueLabel = schema.trueLabel || "Yes";
  const falseLabel = schema.falseLabel || "No";

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <div>
        <h3 className="font-medium text-sm">Edit {tag.displayName}</h3>
        <p className="text-xs text-gray-500 mt-1">
          Current: {formatBooleanValue(currentValue, schema)}
        </p>
      </div>

      <div className="space-y-2">
        <Label>New Value</Label>
        <RadioGroup
          value={value.toString()}
          onValueChange={(stringValue) => setValue(stringValue === "true")}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="true" />
            <Label htmlFor="true" className="font-normal cursor-pointer">
              {trueLabel}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="false" />
            <Label htmlFor="false" className="font-normal cursor-pointer">
              {falseLabel}
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
