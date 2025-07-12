import { Label } from "../../../../components/ui/Label";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/RadioGroup";
import { BooleanSchema } from "../../../../lib/tagValidation";

type BooleanValueInputProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  schema: BooleanSchema;
};

export const BooleanValueInput = ({ value, onChange, schema }: BooleanValueInputProps) => {
  const trueLabel = schema.trueLabel || "Yes";
  const falseLabel = schema.falseLabel || "No";

  return (
    <div className="space-y-2">
      <Label>Value *</Label>
      <RadioGroup
        value={value.toString()}
        onValueChange={(stringValue) => onChange(stringValue === "true")}
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
  );
};
